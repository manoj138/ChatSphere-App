const { handle500 } = require("../helper/errorHandler");
const { handle200 } = require("../helper/successHandler");
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

        return handle200(res, newMessage, "Message sent successfully")
        
    } catch (error) {
        console.log("Error in sendMessage: ", error.message);
        handle500(res, error);
    }
}

module.exports = { getUsersForSlideBar, getMessages, sendMessage };