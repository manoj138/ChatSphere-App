const jwt = require("jsonwebtoken");

const generateToken = (userId, res) => { 
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { // 'userId' match kara
        expiresIn: "15d"
    });

    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development" // Development madhe false rahil
    });

    return token;
};

module.exports = { generateToken };
