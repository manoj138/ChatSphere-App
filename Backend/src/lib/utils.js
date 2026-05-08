const jwt = require("jsonwebtoken");

const getAuthCookieOptions = () => {
    // Better production detection: check NODE_ENV or if we are not on localhost
    const isProd = process.env.NODE_ENV === "production" || process.env.RENDER === "true";
    
    return {
        httpOnly: true,
        sameSite: isProd ? "none" : "lax",
        secure: isProd, // Must be true for sameSite: "none"
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
