const express = require("express");
require("dotenv").config();
const app = express();

const PORT = process.env.PORT ;

app.use(express.json());
const authRouted = require("./src/routes/authRoutes")
const messagesRoute = require("./src/routes/messagesRoute")

app.use("/api/auth", authRouted);
app.use("/api/messages", messagesRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});