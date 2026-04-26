const cloudinary = require("../lib/cloudinary");
const Message = require("../models/message");
const User = require("../models/User");



const getAllContacts = async(req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password")
        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log("Error in getAllContacts:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const getChatPartners = async(req, res) => {
    try {
        const loggedInUserId = req.user._id;
        // find the all the messages where the logged in user is either sender or receiver

        const messages = await Message.find({
            $or:[
                {senderId: loggedInUserId},
                {receiverId: loggedInUserId}
            ]
        }).populate("senderId", "_id name ")

        const chatPartnersIds = [...new Set(messages.map(msg=> msg.senderId.toString() === loggedInUserId.toString() ? msg.receiverId :  msg.senderId))]

        const chatPartners = await User.find({_id: {$in: chatPartnersIds}}).select("-password")

        res.status(200).json(chatPartners)
    } catch (error) {
        console.log("Error in getChatPartners:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const getMessagesByUserId = async(req, res) => {
    try {
        const myId = req.user._id;
        const {id:userToChatId} = req.params;
        const messages = await Message.find({
            $or:[
                {senderId: myId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: myId},
            ]
        })
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessagesByUserId:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const sendMessage = async(req, res) => {
    try {
        const { text, image} = req.body;
     const {id:receiverId} = req.params;
     const senderId = req.user._id;

     let imageUrl;
     if(image){
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
     }

     const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image: imageUrl
     });

     await newMessage.save();

     // todo : send message in real time if user is online using socket.io 
        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: newMessage
        });
    } catch (error) {
        console.log("Error in sendMessage:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

module.exports = {
    getAllContacts,
    getChatPartners,
    getMessagesByUserId,
    sendMessage
}
