const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const User = require("../models/userModel");
const Group = require("../models/groupModel");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        credentials: true
    },
});

const userSocketMap = {};  // {userId : socketId}

const getReceiverSocketId = (userId) => {
    return userSocketMap[userId];
}


io.on("connection", async (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.auth.userId || socket.handshake.query.userId;
    
    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
        console.log(`User mapped: ${userId} -> ${socket.id}`);

        // Automatically join all groups the user belongs to
        try {
            const userGroups = await Group.find({ members: userId });
            userGroups.forEach(group => {
                socket.join(group._id.toString());
                console.log(`User ${userId} joined room: ${group._id}`);
            });
        } catch (err) {
            console.error("Error joining user groups on connect:", err);
        }
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("typing", (data) => {
        const receiverSocketId = getReceiverSocketId(data.receiverId);
        if (receiverSocketId) {
            socket.to(receiverSocketId).emit("usertyping", {
                senderId: data.senderId,
                typing: data.typing
            });
        }
    })

    socket.on("stopTyping",(data)=>{
        const receiverSocketId = getReceiverSocketId(data.receiverId);
        if(receiverSocketId){
            socket.to(receiverSocketId).emit("userStopTyping",{
                senderId: data.senderId
            })
        }
    });

    socket.on("joinGroup", (groupId)=>{
        socket.join(groupId);
        console.log(`Socket ${socket.id} joined group ${groupId}`);
    })

    socket.on("leaveGroup", (groupId)=>{
        socket.leave(groupId);
        console.log(`Socket ${socket.id} left group ${groupId}`);
    })

    socket.on("disconnect", async() => {
        console.log("A user disconnected", socket.id);

        if(userId && userId !== "undefined"){
            try {
                await User.findByIdAndUpdate(userId, {lastSeen: Date.now()});
            } catch (err) {
                console.error("Error updating lastSeen on disconnect:", err);
            }
            delete userSocketMap[userId];
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

module.exports = { io, app, server, getReceiverSocketId };
