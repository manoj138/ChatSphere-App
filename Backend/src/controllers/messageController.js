const { handle500, handle404, handle401 } = require("../helper/errorHandler");
const { handle200, handle201 } = require("../helper/successHandler");
const cloudinary = require("../lib/cloudinary");
const { getReceiverSocketId, io } = require("../lib/socket");

const Message = require("../models/messageModel");
const User = require("../models/userModel");
const FriendRequest = require("../models/friendRequestModel");

const getUsersForSlideBar = async(req, res)=>{
    try {
        const loggedInUserId = req.user._id;

        // Find all accepted friend requests involving the logged-in user
        const acceptedRequests = await FriendRequest.find({
            $or: [
                { sender: loggedInUserId, status: "accepted" },
                { receiver: loggedInUserId, status: "accepted" }
            ]
        });

        // Extract friend IDs
        const friendIds = acceptedRequests.map(req => 
            req.sender.toString() === loggedInUserId.toString() ? req.receiver : req.sender
        );

        // Fetch user details for these friend IDs and attach last message
        const friends = await User.find({ _id: { $in: friendIds } }).select("-password").lean();

        // For each friend, find the last message
        const friendsWithLastMessage = await Promise.all(friends.map(async (friend) => {
            const lastMessage = await Message.findOne({
                $or: [
                    { senderId: loggedInUserId, receiverId: friend._id },
                    { senderId: friend._id, receiverId: loggedInUserId }
                ]
            }).sort({ createdAt: -1 });

            return {
                ...friend,
                lastMessage: lastMessage ? {
                    text: lastMessage.text,
                    image: !!lastMessage.image,
                    createdAt: lastMessage.createdAt,
                    senderId: lastMessage.senderId,
                    isSeen: lastMessage.isSeen
                } : null
            };
        }));

        return handle200(res, friendsWithLastMessage);
    } catch (error) {
        console.log("error in getUsersForSlideBar: ", error);
        handle500(res, error);
    }
}

const getMessages = async(req, res)=>{
  try {
    const {id: userToChatId} = req.params;
     const myId = req.user._id;
   
     const messages = await Message.find({$or:[
        {senderId:myId, receiverId:userToChatId},
        {senderId:userToChatId, receiverId:myId}
     ]})

     return handle200(res, messages, "Messages fetched successfully")
  } catch (error) {
    console.log("Error in getMessages: ", error);
    handle500(res, error);
  }
}

const sendMessage = async(req, res)=>{
    try {
        const {text, image, groupId}= req.body;
        const {id:receiverId}= req.params;
        const senderId = req.user._id;

        let imageUrl;

        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const receiverSocketId = getReceiverSocketId(receiverId);

        const newMessage = new Message({
            senderId, 
            receiverId:groupId ? null : receiverId,
            groupId:groupId || null,
            text: text || "",
            image: imageUrl,
            isDelivered: !!receiverSocketId // If receiver is online, it's delivered
        })

        await newMessage.save();

        if(groupId){ 
            io.to(groupId).emit("newGroupMessage", newMessage)
        } else {
            if(receiverSocketId){
                io.to(receiverSocketId).emit("newMessage", newMessage);
            }
        }

        return handle201(res, newMessage, "Message sent successfully")
    } catch (error) {
        console.log("Error in sendMessage: ", error.message);
        handle500(res, error);
    }
}

const deleteMessage = async(req, res)=>{
    try{
        const {id:messageId} = req.params;
        const userId = req.user._id;
        const message = await Message.findById(messageId);
        
        if(!message){
            return handle404(res, "Message not found");
        }
        if(message.senderId.toString() !== userId.toString()){
            return handle401(res, "You are not authorized to delete this message");
        }

        // Soft delete: keep the record but mark as deleted
        message.isDeleted = true;
        message.text = "This message was deleted";
        if(message.image) message.image = null;
        await message.save();

        // Notify other user(s) via socket
        if(message.groupId){
            io.to(message.groupId.toString()).emit("messageDeleted", { messageId, groupId: message.groupId });
        } else {
            const receiverSocketId = getReceiverSocketId(message.receiverId);
            if(receiverSocketId){
                io.to(receiverSocketId).emit("messageDeleted", { messageId, senderId: message.senderId });
            }
        }

        return handle200(res, message, "Message deleted successfully")
    }catch(error){
        console.log("Error in deleteMessage: ", error);
        handle500(res, error);
    }
}

const reactToMessage = async(req, res)=>{
    try {
        const {id:messageId} = req.params;
        const {emoji} = req.body;
        const userId = req.user._id;

        const message = await Message.findById(messageId);
        if(!message) return handle404(res, "Message not found");

        const existingReactionIndex = message.reactions.findIndex(r => r.userId.toString() === userId.toString());

        if(existingReactionIndex > -1){
            if(message.reactions[existingReactionIndex].emoji === emoji){
                message.reactions.splice(existingReactionIndex, 1);
            } else {
                message.reactions[existingReactionIndex].emoji = emoji;
            }
        } else {
            message.reactions.push({ userId, emoji });
        }

        await message.save();

        const updateData = { messageId, reactions: message.reactions };
        if(message.groupId){
            io.to(message.groupId.toString()).emit("messageReaction", updateData);
        } else {
            const receiverId = message.senderId.toString() === userId.toString() ? message.receiverId : message.senderId;
            const receiverSocketId = getReceiverSocketId(receiverId);
            if(receiverSocketId) io.to(receiverSocketId).emit("messageReaction", updateData);
        }

        return handle200(res, message, "Reaction updated");
    } catch (error) {
        console.log("Error in reactToMessage: ", error);
        handle500(res, error);
    }
}

const markMessagesAsSeen = async(req, res)=>{
    try{
        const {id:senderId} = req.params;
        const recipientId = req.user._id;

        await Message.updateMany({senderId:senderId, receiverId:recipientId, isSeen:false},{$set:{isSeen:true}});
        const senderSocketId = getReceiverSocketId(senderId);
        if(senderSocketId){
            io.to(senderSocketId).emit("messagesSeen", {senderId, recipientId});
        }

        return handle200(res, null, "Messages marked as seen successfully")
    }catch(error){
        console.log("Error in markMessagesAsSeen: ", error);
        handle500(res, error);
    }
}

const searchUsers = async(req, res)=>{
    try {
        const {search}= req.query;
        const loggedInUserId = req.user._id;

        const searchFilter = search ? {
            _id: { $ne: loggedInUserId },
            $or: [
                { username: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ],
        } : { _id: { $ne: loggedInUserId } };

        const users = await User.find(searchFilter).select("-password").limit(20);

        return handle200(res, users, "Users fetched successfully");
    } catch (error) {
        console.log("Error in searchUsers: ", error);
        handle500(res, error);
    }
}

const getGroupMessages = async (req, res)=>{
    try {
        const {id:groupId} = req.params;
        const messages =  await Message.find({groupId:groupId}).populate("senderId", "username profilePicture");
        return handle200(res, messages, "Group messages fetched successfully")
    } catch (error) {
        console.log("Error in getGroupMessages: ", error);
        handle500(res, error);
    }
}

module.exports = { getUsersForSlideBar, getMessages, sendMessage, deleteMessage, markMessagesAsSeen, searchUsers, getGroupMessages };