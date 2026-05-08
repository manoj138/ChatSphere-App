const router = require("express").Router();
const authController = require("../controllers/authController");
const { protectRoute } = require("../middleware/authMiddleware");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.get("/check", protectRoute, authController.checkAuth);

router.put("/update-profile", protectRoute, authController.updateProfile);
router.put("/update-fcm-token", protectRoute, authController.updateFCMToken);

module.exports = router;
