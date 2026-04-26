const router = require("express").Router();

const authController = require("../controllers/authController");
const protectRoute = require("../moddleware/authMiddleware");

router.post("/signup",authController.signup)
router.post("/login",authController.login)
router.post("/logout",authController.logout)

router.put("/update-profile", protectRoute, authController.updateProfile)

module.exports = router;