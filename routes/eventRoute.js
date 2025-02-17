const router = require("express").Router();
const eventController = require("../controllers/event");
const { verifyToken } = require("../middlewares/verify");

router.get("/", verifyToken, eventController.getAll);
router.get("/:id", verifyToken, eventController.getById);
router.post("/", verifyToken, eventController.create);
router.put("/:id", verifyToken, eventController.update);
router.delete("/:id", verifyToken, eventController.delete);
module.exports = router;
