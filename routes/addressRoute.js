const router = require("express").Router();
const addressController = require("../controllers/address");
const { verifyToken } = require("../middlewares/verify");

router.get("/", verifyToken, addressController.getAll);
router.get("/:id", verifyToken, addressController.getById);
router.post("/", verifyToken, addressController.create);
router.put("/:id", verifyToken, addressController.update);
router.delete("/:id", verifyToken, addressController.delete);
module.exports = router;
