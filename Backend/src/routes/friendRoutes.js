const router = require("express").Router();
const { protectRoute } = require("../middleware/authMiddleware");
const friendController = require("../controllers/friendController");

router.post("/send", protectRoute, friendController.sendFriendRequest);
router.get("/pending", protectRoute, friendController.getPendingRequests);
router.post("/respond", protectRoute, friendController.respondToRequest);

module.exports = router;
