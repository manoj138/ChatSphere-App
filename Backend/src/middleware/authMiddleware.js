const jwt = require("jsonwebtoken");
const { handle401 } = require("../helper/errorHandler");


const protectRoute = async (req,res,next) =>{
    try {
        const token = req.cookies.jwt;

        if(!token){
            return handle401(res, "You are not authorized to access this route")
        }

        const decodedToken = jwt.verify()
    } catch (error) {
        
    }
}