const FriendRequest = require("../models/friendRequestModel");
const User = require("../models/userModel");
const { handle500, handle404, handle422, handle401 } = require("../helper/errorHandler");
const { handle200, handle201 } = require("../helper/successHandler");
const { getReceiverSocketId, io } = require("../lib/socket");

const sendFriendRequest = async (req, res) => {
    try {
        const { receiverId } = req.body;
        const senderId = req.user._id;

        if (senderId.toString() === receiverId.toString()) {
            return handle422(res, "You cannot send a request to yourself");
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId }
            ]
        });

        if (existingRequest) {
            return handle422(res, "Request already exists between these users");
        }

        const newRequest = await FriendRequest.create({
            sender: senderId,
            receiver: receiverId,
            status: "pending"
        });

        // Real-time notification via Socket.io
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            // Populate sender info so receiver knows who sent it
            const populatedRequest = await FriendRequest.findById(newRequest._id).populate("sender", "username profilePicture");
            io.to(receiverSocketId).emit("newFriendRequest", populatedRequest);
        }

        return handle201(res, newRequest, "Friend request sent successfully");
    } catch (error) {
        handle500(res, error);
    }
};

const getPendingRequests = async (req, res) => {
    try {
        const userId = req.user._id;
        const requests = await FriendRequest.find({
            receiver: userId,
            status: "pending"
        }).populate("sender", "username profilePicture email");

        return handle200(res, requests);
    } catch (error) {
        handle500(res, error);
    }
};

const respondToRequest = async (req, res) => {
    try {
        const { requestId, status } = req.body; // status: 'accepted' or 'rejected'
        const userId = req.user._id;

        const request = await FriendRequest.findById(requestId);

        if (!request) {
            return handle404(res, "Request not found");
        }

        if (request.receiver.toString() !== userId.toString()) {
            return handle401(res, "Unauthorized");
        }

        request.status = status;
        await request.save();

        // If accepted, notify the sender as well
        if (status === "accepted") {
            const senderSocketId = getReceiverSocketId(request.sender);
            if (senderSocketId) {
                io.to(senderSocketId).emit("friendRequestAccepted", request);
            }
        }

        return handle200(res, request, `Request ${status} successfully`);
    } catch (error) {
        handle500(res, error);
    }
};

module.exports = { sendFriendRequest, getPendingRequests, respondToRequest };
