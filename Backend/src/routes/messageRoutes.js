const router = require("express").Router();

const { protectRoute } = require("../middleware/authMiddleware");

const messageController = require("../controllers/messageController");

router.get("/users-sidebar", protectRoute, messageController.getUsersForSlideBar);
router.get("/search/user", protectRoute, messageController.searchUsers);
router.get("/group/:id", protectRoute, messageController.getGroupMessages);
router.get("/:id", protectRoute, messageController.getMessages);
router.post("/send/:id", protectRoute, messageController.sendMessage);
router.delete("/delete/:id", protectRoute, messageController.deleteMessage);
router.put("/seen/:id", protectRoute, messageController.markMessagesAsSeen);
router.put("/react/:id", protectRoute, messageController.reactToMessage);




module.exports = router;
