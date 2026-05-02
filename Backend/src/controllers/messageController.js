const { handle500 } = require("../helper/errorHandler");
const { handle200, handle201 } = require("../helper/successHandler");
const cloudinary = require("../lib/cloudinary");
const { getReceiverSocketId, io } = require("../lib/socket");

const Message = require("../models/messageModel");
const User = require("../models/userModel");

const getUsersForSlideBar = async(req, res)=>{
    try {
        const loggedInUserId = req.user._id;

        const filteredUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password");

       return handle200(res, filteredUsers)
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
        const {text, image}= req.body;
        const {id:receiverId}= req.params;
        const senderId = req.user._id;

        let imageUrl;

        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId, 
            receiverId,
            text, image: imageUrl
        })

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);

        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
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
// check if message found
 if(!message){
    return handle404(res, "Message not found");
 }
// check if sender is authorized to delete the message 
 if(message.senderId.toString() !== userId.toString()){
    return handle401(res, "You are not authorized to delete this message");
 }
// delete image from cloudinary
 if(message.image){
    const publicId = message.image.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId);
 }
// delete message from database
 await Message.findByIdAndDelete(messageId);

// emit delete message to receiver
 const receiverSocketId = getReceiverSocketId(message.receiverId);

 if(receiverSocketId){
    io.to(receiverSocketId).emit("deleteMessage", messageId);
 }

return handle200(res, null, "Message deleted successfully")
    }catch(error){
        console.log("Error in deleteMessage: ", error);
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

          if(!search){
            return handle404(res, "Search query is required");
          }

          const users = await User.find({
            // Exclude yourself from the search results.
            _id:{$ne: loggedInUserId},
            // This allows you to search by username or email
            $or: [
                { username: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ],
        }).select("-password") // Exclude password from the search results

        return handle200(res, users, "Users fetched successfully");
    } catch (error) {
        console.log("Error in searchUsers: ", error);
        handle500(res, error);
    }
}

module.exports = { getUsersForSlideBar, getMessages, sendMessage, deleteMessage, markMessagesAsSeen, searchUsers };