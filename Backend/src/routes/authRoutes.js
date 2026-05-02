const router = require("express").Router();

const authController = require("../controllers/authController");

const { protectRoute } = require("../middleware/authMiddleware");


router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.get("/check", protectRoute, authController.checkAuth);

router.put("/update-pic", protectRoute, authController.updateProfilePic);

module.exports = router;