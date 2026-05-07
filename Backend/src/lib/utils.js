const jwt = require("jsonwebtoken");

const getAuthCookieOptions = () => {
    const isProd = process.env.NODE_ENV === "production";
    return {
        httpOnly: true,
        sameSite: isProd ? "none" : "lax",
        secure: isProd,
    };
};

const generateToken = (userId, res) => { 
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "15d"
    });

    res.cookie("jwt", token, {
        ...getAuthCookieOptions(),
        maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    return token;
};

module.exports = { generateToken, getAuthCookieOptions };
