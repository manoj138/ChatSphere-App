const jwt = require("jsonwebtoken");
const { handle401, handle500 } = require("../helper/errorHandler");
const User = require("../models/userModel");

const protectRoute = async (req, res, next) => {
    try {
        // Try to get token from cookie first, then from Authorization header
        let token = req.cookies.jwt;

        if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return handle401(res, "Authentication required. Please login again.");
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedToken) {
            return handle401(res, "Invalid token. Please login again.");
        }

        const user = await User.findById(decodedToken.userId).select("-password");
        
        if (!user) {
            return handle401(res, "User not found.");
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return handle401(res, "Session expired. Please login again.");
        }

        handle500(res, error);
    }
};

module.exports = { protectRoute };
