const router = require("express").Router();

const { protectRoute } = require("../middleware/authMiddleware");

const messageController = require("../controllers/messageController");

router.get("/users-sidebar", protectRoute, messageController.getUsersForSlideBar);
router.get("/:id", protectRoute, messageController.getMessages);
router.post("/send/:id", protectRoute, messageController.sendMessage);

module.exports = router;
