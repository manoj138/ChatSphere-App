const express = require("express");

const http = require("http");

const {Server} = require("socket.io");

const cors = require("cors");


require("dotenv").config();

const connectDB =require("./src/config/database")
connectDB()

const app =express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin:"http://localhost:3000",
        methods:["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3001;

app.get("/", (req, res)=>{
    res.send("chat server is running");

})

io.on("connection", (socket)=>{
    console.log("A User Conected", socket.id);

    socket.on("disconnect", ()=>{
        console.log("User disconnected")
    })
    
})

server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
