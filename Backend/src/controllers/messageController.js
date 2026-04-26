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
        
    } catch (error) {
        
    }
}

const getMessagesByUserId = async(req, res) => {
    try {
        
    } catch (error) {
        
    }
}

const sendMessage = async(req, res) => {
    try {
        
    } catch (error) {
        
    }
}

module.exports = {
    getAllContacts,
    getChatPartners,
    getMessagesByUserId,
    sendMessage
}
