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
            try {
                const uploadResponse = await cloudinary.uploader.upload(groupImage, {
                    folder: "chatsphere_groups",
                    resource_type: "auto"
                });
                imageUrl = uploadResponse.secure_url;
            } catch (cloudErr) {
                console.error("Cloudinary ERROR in group creation:", cloudErr.message);
                imageUrl = groupImage; // Fallback to raw data
            }
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

const Message = require("../models/messageModel");

const getMyGroups = async(req, res)=>{
    try {
        const userId = req.user._id;

        const groups = await Group.find({
            members: userId
        }).populate("admin", "username email profilePicture")
          .populate("members", "username profilePicture").lean();

        // For each group, find the last message
        const groupsWithLastMessage = await Promise.all(groups.map(async (group) => {
            const lastMessage = await Message.findOne({
                groupId: group._id
            }).sort({ createdAt: -1 }).populate("senderId", "username");

            const unreadCount = lastMessage && lastMessage.senderId?._id.toString() !== userId.toString() ? 1 : 0;

            return {
                ...group,
                lastMessage: lastMessage ? {
                    text: lastMessage.text,
                    image: !!lastMessage.image,
                    createdAt: lastMessage.createdAt,
                    senderName: lastMessage.senderId?.username || "Member"
                } : null,
                unreadCount
            };
        }));

        return handle200(res, groupsWithLastMessage, "Groups fetched successfully")
    } catch (error) {
        console.log("Error in getMyGroups: ", error);
        handle500(res, error);
    }
}

const updateGroup = async (req, res) => {
    try {
        const { id: groupId } = req.params;
        const { name, groupImage } = req.body;
        const userId = req.user._id;

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });

        if (group.admin.toString() !== userId.toString()) {
            return res.status(401).json({ message: "Only admin can update group settings" });
        }

        if (name) group.name = name;
        if (groupImage) {
            try {
                const uploadResponse = await cloudinary.uploader.upload(groupImage, {
                    folder: "chatsphere_groups",
                    resource_type: "auto"
                });
                group.groupImage = uploadResponse.secure_url;
            } catch (cloudErr) {
                console.error("Cloudinary ERROR in group update:", cloudErr.message);
                // Fallback: save raw data if cloudinary fails
                group.groupImage = groupImage; 
            }
        }

        await group.save();
        
        // Populate before sending back
        const updatedGroup = await Group.findById(group._id)
            .populate("admin", "username email profilePicture")
            .populate("members", "username profilePicture");

        return handle200(res, updatedGroup, "Group updated successfully");
    } catch (error) {
        console.log("Error in updateGroup: ", error);
        handle500(res, error);
    }
}

const deleteGroup = async (req, res) => {
    try {
        const { id: groupId } = req.params;
        const userId = req.user._id;

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });

        if (group.admin.toString() !== userId.toString()) {
            return res.status(401).json({ message: "Only admin can delete group" });
        }

        await Group.findByIdAndDelete(groupId);
        await Message.deleteMany({ groupId });

        return handle200(res, null, "Group deleted successfully");
    } catch (error) {
        console.log("Error in deleteGroup: ", error);
        handle500(res, error);
    }
}

const kickMember = async (req, res) => {
    try {
        const { id: groupId } = req.params;
        const { userId: memberToKick } = req.body;
        const adminId = req.user._id;

        const group = await Group.findById(groupId);
        if (!group) return res.status(404).json({ message: "Group not found" });

        if (group.admin.toString() !== adminId.toString()) {
            return res.status(401).json({ message: "Only admin can kick members" });
        }

        if (group.admin.toString() === memberToKick.toString()) {
            return res.status(400).json({ message: "Admin cannot kick themselves. Use delete group instead." });
        }

        group.members = group.members.filter(m => m.toString() !== memberToKick.toString());
        await group.save();

        const updatedGroup = await Group.findById(groupId)
            .populate("admin", "username email profilePicture")
            .populate("members", "username profilePicture");

        return handle200(res, updatedGroup, "Member kicked successfully");
    } catch (error) {
        console.log("Error in kickMember: ", error);
        handle500(res, error);
    }
}

module.exports = { createGroup, getMyGroups, updateGroup, deleteGroup, kickMember };
