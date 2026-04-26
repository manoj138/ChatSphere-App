const router = require("express").Router();

const messagesController = require("../controllers/messageController");
const arcjetProtection = require("../moddleware/arcjetMiddleware");
const protectRoute = require("../moddleware/authMiddleware");

router.use(arcjetProtection, protectRoute);
router.get("/contacts", messagesController.getAllContacts);
router.get("/chats", messagesController.getChatPartners);
router.get("/:id", messagesController.getMessagesByUserId);
router.post("/send/:id", messagesController.sendMessage);



module.exports = router;