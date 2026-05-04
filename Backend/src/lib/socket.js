const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const User = require("../models/userModel");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"], // Updated to match your frontend port
        credentials: true
    },
});

const userSocketMap = {};  // {userId : socketId}

const getReceiverSocketId = (userId) => {    // get receiver socket id
    return userSocketMap[userId];
}


io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    // Support both handshake.auth and handshake.query for flexibility
    const userId = socket.handshake.auth.userId || socket.handshake.query.userId;
    
    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
        console.log(`User mapped: ${userId} -> ${socket.id}`);
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
        console.log(`user ${userId} joined group ${groupId}`);
    })

    socket.on("leaveGroup", (groupId)=>{
        socket.leave(groupId);
        console.log(`user ${userId} left group ${groupId}`);
    })

    socket.on("disconnect", async() => {
        console.log("A user disconnected", socket.id);

        if(userId && userId !== "undefined"){
            await User.findByIdAndUpdate(userId, {lastSeen: Date.now()});
            delete userSocketMap[userId];
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

module.exports = { io, app, server, getReceiverSocketId };
