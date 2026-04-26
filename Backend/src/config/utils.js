const jwt = require("jsonwebtoken");

const genarateToken = (userId, res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET_KEY, {expiresIn: "15d"})
    
    res.cookie("jwt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development"
    })
    return token;
}

module.exports = genarateToken;