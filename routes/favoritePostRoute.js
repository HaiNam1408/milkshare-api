const router = require("express").Router();
const favoriteController = require("../controllers/favoritepost");
const { verifyToken } = require("../middlewares/verify");

router.get("/", verifyToken, favoriteController.getAll);
router.get("/:id", verifyToken, favoriteController.getById);
router.post("/", verifyToken, favoriteController.create);
router.put("/:fid", verifyToken, favoriteController.update);
router.delete("/:fid", verifyToken, favoriteController.delete);
module.exports = router;
