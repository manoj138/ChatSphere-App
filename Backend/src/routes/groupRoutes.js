const router = require("express").Router();
const {protectRoute} = require("../middleware/authMiddleware");

const groupController = require("../controllers/groupController");

router.post("/create",protectRoute, groupController.createGroup);
router.get("/my-groups", protectRoute, groupController.getMyGroups);

module.exports = router;