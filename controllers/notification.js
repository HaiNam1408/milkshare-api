const asyncHandler = require("express-async-handler");
const db = require("../models");
const admin = require("../config/firebase.config");

module.exports = {
  getAll: asyncHandler(async (req, res) => {
    const notifications = await db.Notification.findAll({
      include: [
        {
          model: db.User,
          as: "sender",
          attributes: ["id", "username", "avatar_url"],
        },
      ],
    });
    if (!notifications) {
      return res.status(400).json({
        success: false,
        message: "Get all notifications failed",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Get all notifications successfully",
      data: notifications,
    });
  }),

  getByUserId: asyncHandler(async (req, res) => {
    const { id: userId } = req.user;
    const notifications = await db.Notification.findAll({
      where: { user_id: userId },
      include: [
        {
          model: db.User,
          as: "sender",
          attributes: ["id", "username", "avatar_url"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    if (!notifications) {
      return res.status(400).json({
        success: false,
        message: "Get all notifications failed",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Get all notifications successfully",
      data: notifications,
    });
  }),

  create: asyncHandler(async (req, res) => {
    const { id: sender_id } = req.user;
    req.body = { ...req.body, sender_id };
    const notification = await db.Notification.create(req.body);
    if (notification) {
      return res.status(200).json({
        success: true,
        message: "Notification created successfully",
        data: notification,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Failed to create notification",
      });
    }
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const notification = await db.Notification.findByPk(id, {
      include: [
        {
          model: db.User,
          as: "sender",
          attributes: ["id", "username", "avatar_url"],
        },
      ],
    });
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Notification found",
      data: notification,
    });
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const notification = await db.Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }
    await notification.update(req.body);
    return res.status(200).json({
      success: true,
      message: "Notification updated successfully",
      data: notification,
    });
  }),

  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const notification = await db.Notification.findByPk(id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }
    await notification.destroy();
    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  }),

  pushNotif: asyncHandler(async (req, res) => {
    const { deviceToken, title, body, image } = req.body;

    const message = {
      notification: {
        title: title,
        body: body,
        image: image,
      },
      token: deviceToken,
    };

    try {
      const response = await admin.messaging().send(message);
      res.status(200).json({
        success: true,
        message: "Notification sent successfully",
        response,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to send notification",
        error,
      });
    }
  }),
};
