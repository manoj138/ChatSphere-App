require("dotenv").config();
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser"); 
const connectDB = require("./src/config/database");
const { app, server, io } = require("./src/lib/socket");


connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

const authRoutes = require("./src/routes/authRoutes");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Chat Server is running");
});


const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
