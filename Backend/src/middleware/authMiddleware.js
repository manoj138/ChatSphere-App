const jwt = require("jsonwebtoken");
const { handle401, handle500 } = require("../helper/errorHandler");
const User = require("../models/userModel");


const protectRoute = async (req,res,next) =>{
    try {
        const token = req.cookies.jwt;

        if(!token){
            return handle401(res, "You are not authorized to access this route")
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if(!decodedToken){
            return handle401(res, "You are not authorized to access this route")
        }

        const user = await User.findById(decodedToken.userId).select("-password");
        
        if(!user){
            return handle401(res, "User not found")
        }
        req.user = user;
        next()
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error.message);
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return handle401(res, "Session expired. Please login again");
        }

        handle500(res, error)
    }
}



module.exports = { protectRoute }
