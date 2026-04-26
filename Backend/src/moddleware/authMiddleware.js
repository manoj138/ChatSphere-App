const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - No token found"
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        if(!decoded){
            return res.status(401).json({
                success: false,
                message: "Unauthorized - Invalid token"
            })
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - User not found"
            })
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}   

module.exports = protectRoute;
