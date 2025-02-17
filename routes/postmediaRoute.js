const router = require("express").Router();
const mediaController = require("../controllers/postmedia");
const { verifyToken } = require("../middlewares/verify");

router.get("/", verifyToken, mediaController.getAll);
router.get("/:id", verifyToken, mediaController.getById);
router.delete("/:id", verifyToken, mediaController.delete);
module.exports = router;
