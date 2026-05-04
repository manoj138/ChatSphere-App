const { handle422, handle500 } = require("../helper/errorHandler");
const { handle201, handle200 } = require("../helper/successHandler");
const Group = require("../models/groupModel");
const cloudinary = require("../lib/cloudinary");

const createGroup = async (req, res)=>{
    try {
        const {name, members, groupImage} = req.body;
        const adminId = req.user._id;

        if(!name || !members || members.length === 0){
            return handle422(res, "group name and at least one member is required")
        }

        let imageUrl = "";
        if (groupImage) {
            const uploadResponse = await cloudinary.uploader.upload(groupImage, {
                folder: "chatsphere_groups"
            });
            imageUrl = uploadResponse.secure_url;
        }

        const allMembers = [...new Set([...members, adminId])];

        const newGroup = await Group.create({
            name, admin: adminId, members: allMembers, groupImage: imageUrl
        });

        return handle201(res, newGroup, "Group created successfully");
    } catch (error) {
        console.log("Error in createGroup: ", error);
        handle500(res, error);
    }
}

const getMyGroups = async(req, res)=>{
    try {
        const userId = req.user._id;

        const groups = await Group.find({
            members: userId
        }).populate("admin", "username email profilePicture")
          .populate("members", "username profilePicture");

        return handle200(res, groups, "Groups fetched successfully")
    } catch (error) {
        console.log("Error in getMyGroups: ", error);
        handle500(res, error);
    }
}

module.exports = { createGroup, getMyGroups };
