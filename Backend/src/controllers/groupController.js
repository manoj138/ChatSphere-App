const { handle422 } = require("../helper/errorHandler");
const { handle201, handle200 } = require("../helper/successHandler");
const Group = require("../models/groupModel");

const createGroup = async (req, res)=>{
    try {
        const {name, members, groupImage} = req.body;

        const adminId = req.user._id;

        if(!name || !members || members.length === 0){
            return handle422(res, "group name and at least one member is required")
        }

        const allMembers = [...new Set([...members, adminId])];

        const newGroup = await Group.create({
            name, admin: adminId, members: allMembers, groupImage
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
            member:userId
        }).populate("admin", "username email")
      return  handle200(res, groups, "Groups fetched successfully")
    } catch (error) {
        console.log("Error in getMyGroups: ", error);
        handle500(res, error);
    }
}

module.exports = { createGroup, getMyGroups };
