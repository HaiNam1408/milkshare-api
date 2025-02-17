const asyncHandler = require("express-async-handler");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const bcrypt = require("bcrypt");
const db = require("../models");
const createPasswordChangeCode = require("../utils/createChangePasswordToken");
const renderEmailForgotPassword = require("../utils/renderEmailForgotPassword");
const sendMail = require("../utils/sendMail");
module.exports = AuthController = {
  register: asyncHandler(async (req, res) => {
    try {
      const { email, password, username, phone } = req.body;

      const existingUser = await db.User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email đã được sử dụng",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = await db.User.create({
        email,
        password: hashedPassword,
        username,
        phone,
      });

      const doctorList = await db.User.findAll({
        where: {
          role_code: 2,
        },
      });

      await Promise.all(
        doctorList.map((doctor) => {
          return db.Conversation.create({
            creator_user_id: newUser.id,
            other_user_id: doctor.id,
          });
        })
      );

      return res.json({
        success: true,
        message: "Đăng ký thành công",
        data: newUser,
      });
    } catch (error) {
      console.log(error);
    }
  }),

  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Account does not exist",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Wrong password",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await user.update({ refresh_token: refreshToken });

    return res.json({
      success: true,
      message: "Login successfully",
      data: {
        user: user,
        tokens: accessToken,
      },
    });
  }),

  loginByGG: asyncHandler(async (req, res) => {
    const { ggId } = req.body;

    try {
      let user = await db.User.findOne({ where: { ggId } });
      if (!user) {
        user = await db.User.create(req.body);

        const doctorList = await db.User.findAll({
          where: {
            role_code: 2,
          },
        });

        await Promise.all(
          doctorList.map((doctor) => {
            return db.Conversation.create({
              creator_user_id: user.id,
              other_user_id: doctor.id,
            });
          })
        );
      }
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      await user.update({ refresh_token: refreshToken });

      return res.json({
        success: true,
        message: "Login successfully",
        data: {
          user: user,
          tokens: accessToken,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }),

  loginByFB: asyncHandler(async (req, res) => {
    const { fbId } = req.body;

    try {
      let user = await db.User.findOne({ where: { fbId } });
      if (!user) {
        user = await db.User.create(req.body);

        const doctorList = await db.User.findAll({
          where: {
            role_code: 2,
          },
        });

        await Promise.all(
          doctorList.map((doctor) => {
            return db.Conversation.create({
              creator_user_id: user.id,
              other_user_id: doctor.id,
            });
          })
        );
      }
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      await user.update({ refresh_token: refreshToken });

      return res.json({
        success: true,
        message: "Login successfully",
        data: {
          user: user,
          tokens: accessToken,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }),

  getCodeResetPassword: asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Account does not exist",
      });
    }
    const { code, codeExpires } = createPasswordChangeCode();
    await user.update({
      resetPasswordCode: code,
      resetPasswordCodeExpires: codeExpires,
    });

    const html = renderEmailForgotPassword(user.username, code);
    const data = {
      email,
      html,
    };

    const rs = await sendMail(data);
    return res.status(200).json({
      success: true,
      message: "Send code successfully",
      data: rs,
    });
  }),

  checkCodeResetPassword: asyncHandler(async (req, res) => {
    const { email, code } = req.body;
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Account does not exist",
      });
    }
    if (user.resetPasswordCode !== code) {
      return res.status(400).json({
        success: false,
        message: "Your code have wrong!",
      });
    }
    if (user.resetPasswordCodeExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Code have been expired!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Check code successfully",
    });
  }),

  resetPassword: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Account does not exist",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await user.update({ password: hashedPassword });
    await user.update({ resetPasswordCode: null });
    await user.update({ resetPasswordCodeExpires: null });
    return res.status(200).json({
      success: true,
      message: "Reset password successfully",
    });
  }),
};
