const router = require("express").Router();
const postController = require("../controllers/post");
const { verifyToken } = require("../middlewares/verify");
const {
  uploadFile,
  uploadToR2,
  deleteFileOnR2,
} = require("../middlewares/uploadFile");

router.get("/", verifyToken, postController.getAll);
router.get("/:id", verifyToken, postController.getById);
router.post("/", [verifyToken, uploadFile, uploadToR2], postController.create);
router.put("/:id", verifyToken, postController.update);
router.delete("/:id", [verifyToken, deleteFileOnR2], postController.delete);
module.exports = router;
