const router = require("express").Router();
const { protectRoute } = require("../middleware/authMiddleware");
const friendController = require("../controllers/friendController");
const User = require("../models/userModel");
const { handle200 } = require("../helper/successHandler");

router.post("/send", protectRoute, friendController.sendFriendRequest);
router.get("/pending", protectRoute, friendController.getPendingRequests);
router.post("/respond", protectRoute, friendController.respondToRequest);

// Discover new users
router.get("/all-users", protectRoute, async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user._id } }).select("-password");
        return handle200(res, users);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
