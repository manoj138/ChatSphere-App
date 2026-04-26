const router = require("express").Router();

const messagesController = require("../controllers/messageController");
const protectRoute = require("../moddleware/authMiddleware");

router.get("/contacts",protectRoute, messagesController.getAllContacts);
router.get("/chats", messagesController.getChatPartners);
router.get("/:id", messagesController.getMessagesByUserId);
router.post("/send/:id", messagesController.sendMessage);



module.exports = router;