const jwt = require("jsonwebtoken");


const protectRoute = async (req,res,next) =>{
    try {
        const token = req.cookies.jwt;

        if(!token){
            return
        }
    } catch (error) {
        
    }
}