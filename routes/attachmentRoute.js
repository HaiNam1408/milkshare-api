const router = require("express").Router();
const attachmentController = require("../controllers/attachment");
const { verifyToken } = require("../middlewares/verify");

router.get("/", verifyToken, attachmentController.getAll);
router.post("/", verifyToken, attachmentController.create);
router.delete("/", verifyToken, attachmentController.delete);
router.put("/:id", verifyToken, attachmentController.update);
module.exports = router;
