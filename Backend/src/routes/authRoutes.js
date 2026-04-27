const router = require("express").Router();

const authController = require("../controllers/authController");
const arcjetProtection = require("../moddleware/arcjetMiddleware");
const protectRoute = require("../moddleware/authMiddleware");

router.use(arcjetProtection);
router.post("/signup",authController.signup)
router.post("/login",authController.login)
router.post("/logout",authController.logout)

router.put("/update-profile", protectRoute, authController.updateProfile)
router.get("/check", protectRoute, authController.checkAuth)


module.exports = router;