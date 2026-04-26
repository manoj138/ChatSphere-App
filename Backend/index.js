const express = require("express");
require("dotenv").config();
const app = express();
// const path = require("path");
const PORT = process.env.PORT ;
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/db");

app.use(express.json());
app.use(cookieParser())
// const __dirname = path.resolve();

const authRouted = require("./src/routes/authRoutes")
const messagesRoute = require("./src/routes/messagesRoute");

app.use("/api/auth", authRouted);
app.use("/api/messages", messagesRoute);

// if(process.env.NODE_ENV === "production"){
//     app.use(express.static(path.join(__dirname, "/frontend/dist")));
// }

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
    connectDB()
});