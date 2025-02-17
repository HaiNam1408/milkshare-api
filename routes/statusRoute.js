const router = require("express").Router();
const statusController = require("../controllers/status");
const { verifyToken } = require("../middlewares/verify");

router.get("/", verifyToken, statusController.getAll);
router.get("/:id", verifyToken, statusController.getById);
router.post("/", verifyToken, statusController.create);
router.put("/:id", verifyToken, statusController.update);
router.put("/accept/:id", verifyToken, statusController.updateAcceptStatus);
router.delete("/:id", verifyToken, statusController.delete);
module.exports = router;
