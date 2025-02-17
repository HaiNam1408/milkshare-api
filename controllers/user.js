const asyncHandler = require("express-async-handler");
const db = require("../models");
const bcrypt = require("bcrypt");
const { deleteAvatarOnR2 } = require("../middlewares/uploadFile");

module.exports = userController = {
  getAllUser: asyncHandler(async (req, res) => {
    const users = await db.User.findAll({
      attributes: {
        exclude: [
          "password",
          "refresh_token",
          // "device_key",
          "resetPasswordCode",
          "resetPasswordCodeExpires",
        ],
      },
    });
    if (!users) {
      return res.status(400).json({
        success: false,
        message: "Get all users failed",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Get all users successfully",
      data: users,
    });
  }),

  getUserById: asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await db.User.findByPk(userId, {
      include: [
        {
          model: db.Address,
          as: "address",
        },
      ],
      attributes: {
        exclude: [
          "password",
          "refresh_token",
          // "device_key",
          "resetPasswordCode",
          "resetPasswordCodeExpires",
        ],
      },
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Get user successfully",
      data: user,
    });
  }),

  createUser: asyncHandler(async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
    const newUser = await db.User.create(req.body);
    if (!newUser) {
      return res.status(400).json({
        success: false,
        message: "Create user failed",
      });
    }
    const usersWithRole2 = await db.User.findAll({
      where: {
        role_code: 2,
      },
    });

    const conversations = await Promise.all(
      usersWithRole2.map((user) => {
        return db.Conversation.create({
          creator_user_id: newUser.id,
          other_user_id: user.id,
        });
      })
    );
    return res.status(200).json({
      success: true,
      message: "Create user successfully",
      data: newUser,
    });
  }),

  updateUser: asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const updates = { ...req.body };

    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    await user.update(updates);

    return res.status(200).json({
      success: true,
      message: "Cập nhật thông tin thành công",
      data: user,
    });
  }),

  changePassword: asyncHandler(async (req, res) => {
    const { id: userId } = req.user;
    const { oldPassword, newPassword } = req.body;
    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu cũ không chính xác!",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(newPassword, salt);
    await user.update({ password });
    return res.status(200).json({
      success: true,
      message: "Đổi mật khẩu thành công",
    });
  }),

  uploadAvatar: asyncHandler(async (req, res) => {
    const { id: userId } = req.user;
    const { media_list } = req.body;
    if (!media_list || media_list.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy nguồn ảnh!",
      });
    }
    const t = await db.sequelize.transaction();

    const user = await db.User.findByPk(userId, { transaction: t });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }
    if (user.avatar_url) {
      await deleteAvatarOnR2(user.avatar_url);
    }

    await user.update({ avatar_url: media_list[0] });
    return res.status(200).json({
      success: true,
      message: "Cập nhật avatar thành công",
      data: user,
    });
  }),

  deleteUser: asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }
    await user.destroy();
    return res.status(200).json({
      success: true,
      message: "Xóa tài khoản thành công",
    });
  }),
};
