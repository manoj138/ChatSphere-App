const jwt = require("jsonwebtoken");

const getAuthCookieOptions = () => {
    // Force cross-site cookies for production (Render/Vercel)
    return {
        httpOnly: true,
        sameSite: "none",
        secure: true,
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
