const router = require("express").Router();
const notificationController = require("../controllers/notification");
const { verifyToken } = require("../middlewares/verify");

router.get("/", verifyToken, notificationController.getAll);
router.get("/user", verifyToken, notificationController.getByUserId);
router.get("/:id", verifyToken, notificationController.getById);
router.post("/", verifyToken, notificationController.create);
router.post("/push", verifyToken, notificationController.pushNotif);
router.put("/:id", verifyToken, notificationController.update);
router.delete("/:id", verifyToken, notificationController.delete);
module.exports = router;
