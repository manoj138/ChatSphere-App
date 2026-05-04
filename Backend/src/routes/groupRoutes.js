const router = require("express").Router();
const {protectRoute} = require("../middleware/authMiddleware");

const groupController = require("../controllers/groupController");

router.post("/create",protectRoute, groupController.createGroup);
router.get("/my-groups", protectRoute, groupController.getMyGroups);
router.put("/update/:id", protectRoute, groupController.updateGroup);
router.put("/kick/:id", protectRoute, groupController.kickMember);
router.delete("/delete/:id", protectRoute, groupController.deleteGroup);

module.exports = router;