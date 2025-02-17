const router = require("express").Router();
const Joi = require("joi");
const authController = require("../controllers/auth");
const userController = require("../controllers/user");
const ValidateDto = require("../middlewares/validation");
const { stringReq, numberReq } = require("../middlewares/joiSchema");
const { verifyToken, verifyAdmin } = require("../middlewares/verify");
const {
  uploadFile,
  uploadToR2,
  deleteFileOnR2,
} = require("../middlewares/uploadFile");

router.get("/", verifyToken, userController.getAllUser);
router.post("/create", [verifyToken, verifyAdmin], userController.createUser);
router.post("/change-password", verifyToken, userController.changePassword);
router.post(
  "/upload-avatar",
  [verifyToken, uploadFile, uploadToR2],
  userController.uploadAvatar
);
router.get("/:id", verifyToken, userController.getUserById);
router.put("/:id", verifyToken, userController.updateUser);
router.delete("/:id", verifyToken, userController.deleteUser);
router.post(
  "/register",
  ValidateDto(
    Joi.object({
      password: stringReq,
      username: stringReq,
      email: stringReq,
      phone: numberReq,
    })
  ),
  authController.register
);

router.post("/gg-login", authController.loginByGG);
router.post("/fb-login", authController.loginByFB);
router.post(
  "/login",
  ValidateDto(
    Joi.object({
      email: stringReq,
      password: stringReq,
    })
  ),
  authController.login
);
router.post("/getcode", authController.getCodeResetPassword);
router.post("/checkcode", authController.checkCodeResetPassword);
router.post("/resetpassword", authController.resetPassword);
module.exports = router;
