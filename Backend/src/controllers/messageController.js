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



module.exports = { getUsersForSlideBar };