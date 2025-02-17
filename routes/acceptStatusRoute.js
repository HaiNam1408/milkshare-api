const router = require("express").Router();
const acceptController = require("../controllers/acceptstatus");
const { verifyToken } = require("../middlewares/verify");

router.get("/", verifyToken, acceptController.getAll);
router.post("/", verifyToken, acceptController.create);
router.get("/status/:id", verifyToken, acceptController.getByStatusId);
router.get("/:id", verifyToken, acceptController.getById);
router.put("/:id", verifyToken, acceptController.update);
router.delete("/:id", verifyToken, acceptController.delete);
module.exports = router;
