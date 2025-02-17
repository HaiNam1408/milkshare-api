const router = require("express").Router();
const conversationController = require("../controllers/conversation");
const { verifyToken } = require("../middlewares/verify");

router.get("/", verifyToken, conversationController.getAll);
router.get("/user", verifyToken, conversationController.getByUserId);
router.get("/doctor", verifyToken, conversationController.getListDoctor);
router.get("/:id", verifyToken, conversationController.getById);
router.post("/", verifyToken, conversationController.create);
// router.put("/:id", verifyToken, conversationController.update);
router.delete("/:id", verifyToken, conversationController.delete);
module.exports = router;
