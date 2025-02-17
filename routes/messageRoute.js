const router = require("express").Router();
const messageController = require("../controllers/message");
const { verifyToken } = require("../middlewares/verify");
const { uploadFile, uploadToR2 } = require("../middlewares/uploadFile");

router.get("/", verifyToken, messageController.getAll);
router.get(
  "/conversation/:id",
  verifyToken,
  messageController.getByConversationId
);
router.post(
  "/attchment",
  [verifyToken, uploadFile, uploadToR2],
  messageController.sendAttachment
);
router.get("/:id", verifyToken, messageController.getById);
router.post("/", verifyToken, messageController.create);
router.put("/:id", verifyToken, messageController.update);
router.delete("/:id", verifyToken, messageController.delete);
module.exports = router;
