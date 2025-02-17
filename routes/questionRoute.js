const router = require("express").Router();
const questionController = require("../controllers/question");
const { verifyToken } = require("../middlewares/verify");

router.get("/", verifyToken, questionController.getAll);
router.post("/create", verifyToken, questionController.create);
router.get("/newest", verifyToken, questionController.getAllNewestQuestion);
router.get("/:id", verifyToken, questionController.getById);
router.put("/:id", verifyToken, questionController.update);
router.delete("/:id", verifyToken, questionController.delete);
module.exports = router;
