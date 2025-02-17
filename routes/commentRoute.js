const router = require("express").Router();
const commentController = require("../controllers/comment");
const { verifyToken } = require("../middlewares/verify");

router.get("/", verifyToken, commentController.getAll);
router.get("/:id", verifyToken, commentController.getByPostId);
router.post("/", verifyToken, commentController.create);
router.put("/:id", verifyToken, commentController.update);
router.delete("/:id", verifyToken, commentController.delete);
module.exports = router;
