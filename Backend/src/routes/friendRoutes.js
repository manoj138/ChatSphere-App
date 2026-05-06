const router = require("express").Router();
const { protectRoute } = require("../middleware/authMiddleware");
const friendController = require("../controllers/friendController");
const User = require("../models/userModel");
const FriendRequest = require("../models/friendRequestModel");
const { handle200 } = require("../helper/successHandler");

router.post("/send", protectRoute, friendController.sendFriendRequest);
router.get("/pending", protectRoute, friendController.getPendingRequests);
router.post("/respond", protectRoute, friendController.respondToRequest);

// Discover new users (excluding current friends and pending requests)
router.get("/all-users", protectRoute, async (req, res) => {
    try {
        const userId = req.user._id;

        // Find all relationships (accepted or pending) involving the current user
        const relationships = await FriendRequest.find({
            $or: [{ sender: userId }, { receiver: userId }]
        });

        // Collect all user IDs involved in these relationships
        const relatedUserIds = relationships.map(rel => 
            rel.sender.toString() === userId.toString() ? rel.receiver : rel.sender
        );

        // Add current user to the exclusion list
        relatedUserIds.push(userId);

        // Find users who are NOT in the relatedUserIds list
        const users = await User.find({ _id: { $nin: relatedUserIds } }).select("-password");
        
        return handle200(res, users);
    } catch (error) {
        console.error("Error in all-users route:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
