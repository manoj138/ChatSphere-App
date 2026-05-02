const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],  // forontend url will add here after deployment
    },
});

const userSocketMap = {};  // {userId : socketId}

const getReceiverSocketId = (userId) => {    // get receiver socket id
    return userSocketMap[userId];
}


io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    const userId = socket.handshake.auth.userId; // user id is coming from frontend
    if (userId) {
        userSocketMap[userId] = socket.id; // store user id and socket id in userSocketMap
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // emit online users to all connected clients

    socket.on("typing", (data) => {

        const receiverSocketId = getReceiverSocketId(data.receiverId); // get receiver socket id

        if (receiverSocketId) {
            socket.to(receiverSocketId).emit("usertyping", {
                senderId: data.senderId,
                typing: data.typing
            }); // emit typing to receiver
        }
    })


    socket.on("stopTyping",(data)=>{
        const receiverSocketId = getReceiverSocketId(data.receiverId);
        if(receiverSocketId){
            socket.to(receiverSocketId).emit("userStopTyping",{
                senderId: data.senderId
            }) // emit stop typing to receiver
        }
    })

    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
        delete userSocketMap[userId]; // remove user id and socket id from userSocketMap
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); // emit online users to all connected clients
    });
});

module.exports = { io, app, server, getReceiverSocketId };
