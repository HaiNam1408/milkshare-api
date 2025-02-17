const router = require("express").Router();
const favoriteController = require("../controllers/favoritestatus");
const { verifyToken } = require("../middlewares/verify");

router.get("/", verifyToken, favoriteController.getAll);
router.get("/status/:id", verifyToken, favoriteController.getByStatusId);
router.get("/user", verifyToken, favoriteController.getByUserId);
router.get("/:id", verifyToken, favoriteController.getById);
router.post("/", verifyToken, favoriteController.create);
router.put("/:fid", verifyToken, favoriteController.update);
router.delete("/:fid", verifyToken, favoriteController.delete);
module.exports = router;
