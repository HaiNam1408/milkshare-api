const router = require("express").Router();
const ratingController = require("../controllers/rating");
const { verifyToken } = require("../middlewares/verify");

router.get("/", verifyToken, ratingController.getAll);
router.get("/user/:id", verifyToken, ratingController.getByUserId);
router.get("/:id", verifyToken, ratingController.getById);
router.post("/", verifyToken, ratingController.create);
router.put("/:id", verifyToken, ratingController.update);
router.delete("/:id", verifyToken, ratingController.delete);
module.exports = router;
