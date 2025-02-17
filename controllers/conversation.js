const asyncHandler = require("express-async-handler");
const db = require("../models");
const { Op } = require("sequelize");

module.exports = {
  getAll: asyncHandler(async (req, res) => {
    const conversations = await db.Conversation.findAll({
      include: [
        {
          model: db.User,
          as: "creator_user",
          attributes: ["id", "username", "avatar_url"],
        },
        {
          model: db.User,
          as: "other_user",
          attributes: ["id", "username", "avatar_url", "role_code"],
        },
        {
          model: db.Message,
          as: "last_message",
          attributes: [
            "id",
            "sender_id",
            "receiver_id",
            "is_read",
            "message",
            "createdAt",
          ],
          include: [
            {
              model: db.User,
              as: "sender",
              attributes: ["id", "username", "avatar_url"],
            },
            {
              model: db.User,
              as: "receiver",
              attributes: ["id", "username", "avatar_url"],
            },
          ],
        },
      ],
    });

    if (!conversations) {
      return res.status(400).json({
        success: false,
        message: "Get all conversations failed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Get all conversations successfully",
      data: conversations,
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const conversation = await db.Conversation.findByPk(id, {
      include: [
        {
          model: db.User,
          as: "creator_user",
          attributes: ["id", "username", "avatar_url"],
        },
        {
          model: db.User,
          as: "other_user",
          attributes: ["id", "username", "avatar_url", "role_code"],
        },
        {
          model: db.Message,
          as: "last_message",
          attributes: [
            "id",
            "sender_id",
            "receiver_id",
            "is_read",
            "message",
            "createdAt",
          ],
          include: [
            {
              model: db.User,
              as: "sender",
              attributes: ["id", "username", "avatar_url"],
            },
            {
              model: db.User,
              as: "receiver",
              attributes: ["id", "username", "avatar_url"],
            },
          ],
        },
      ],
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Get conversation successfully",
      data: conversation,
    });
  }),

  getListDoctor: asyncHandler(async (req, res) => {
    const { id: user_id } = req.user;
    const doctors = await db.User.findAll({
      where: { role_code: 2 },
      attributes: ["id", "username", "avatar_url"],
    });
    if (!doctors) {
      return res.status(400).json({
        success: false,
        message: "Get list doctor failed",
      });
    }
    const conversations = [];
    for (let doctor of doctors) {
      const conversation = await db.Conversation.findOne({
        where: {
          [db.Sequelize.Op.or]: [
            { creator_user_id: doctor.id, other_user_id: user_id },
            { creator_user_id: user_id, other_user_id: doctor.id },
          ],
        },
      });
      if (conversation) {
        conversations.push(conversation);
      } else {
        const newConversation = await db.Conversation.create({
          creator_user_id: user_id,
          other_user_id: doctor.id,
        });
        conversations.push(newConversation);
      }
    }
    return res.status(200).json({
      success: true,
      message: "Get list doctor successfully",
      data: conversations,
    });
  }),

  getByUserId: asyncHandler(async (req, res) => {
    console.log(req.user);
    const { id: user_id } = req.user;

    const conversations = await db.Conversation.findAll({
      where: {
        [Op.or]: [{ creator_user_id: user_id }, { other_user_id: user_id }],
      },
      include: [
        {
          model: db.User,
          as: "creator_user",
          attributes: ["id", "username", "avatar_url"],
        },
        {
          model: db.User,
          as: "other_user",
          attributes: ["id", "username", "avatar_url", "role_code"],
        },
        {
          model: db.Message,
          as: "last_message",
          attributes: [
            "id",
            "sender_id",
            "receiver_id",
            "is_read",
            "message",
            "createdAt",
          ],
          include: [
            {
              model: db.User,
              as: "sender",
              attributes: ["id", "username", "avatar_url"],
            },
            {
              model: db.User,
              as: "receiver",
              attributes: ["id", "username", "avatar_url"],
            },
          ],
        },
      ],
      order: [["updatedAt", "DESC"]],
    });

    if (!conversations || conversations.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No conversations found for the user",
      });
    }

    for (const conversation of conversations) {
      const unreadMessagesCount = await db.Message.count({
        where: {
          conversation_id: conversation.id,
          receiver_id: user_id,
          is_read: false,
        },
      });

      conversation.dataValues.unread_count = unreadMessagesCount;
    }

    return res.status(200).json({
      success: true,
      message: "Get conversations by user_id successfully",
      data: conversations,
    });
  }),

  create: asyncHandler(async (req, res) => {
    const { id: creator_user_id } = req.user;
    const { other_user_id } = req.body;

    const existingConversation = await db.Conversation.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { creator_user_id, other_user_id },
          { creator_user_id: other_user_id, other_user_id: creator_user_id },
        ],
      },
    });

    if (existingConversation) {
      return res.status(200).json({
        success: true,
        message: "Conversation already exists",
        data: existingConversation,
      });
    }

    const conversation = await db.Conversation.create({
      creator_user_id,
      other_user_id,
    });

    return res.status(200).json({
      success: true,
      message: "Conversation created successfully",
      data: conversation,
    });
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { last_message_id, unread_count } = req.body;
    const conversation = await db.Conversation.findByPk(id);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }
    await conversation.update({ last_message_id, unread_count });
    return res.status(200).json({
      success: true,
      message: "Conversation updated successfully",
      data: conversation,
    });
  }),

  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const conversation = await db.Conversation.findByPk(id);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }
    await conversation.destroy();
    return res.status(200).json({
      success: true,
      message: "Conversation deleted successfully",
    });
  }),

  findConversation: asyncHandler(async (req, res) => {
    const { id } = req.body;
    const conversation = await db.Conversation.findOne({
      where: {
        [db.Sequelize.Op.or]: [{ creator_user_id: id }, { other_user_id: id }],
      },
      include: [
        {
          model: db.User,
          as: "creator_user",
          attributes: ["id", "username", "avatar_url"],
        },
        {
          model: db.User,
          as: "other_user",
          attributes: ["id", "username", "avatar_url"],
        },
      ],
    });
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Conversation found successfully",
      data: conversation,
    });
  }),
};
