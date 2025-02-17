const asyncHandler = require("express-async-handler");
const db = require("../models");
const { bucket } = require("../config/cloudflare.config");
const { sendMessageNotif } = require("../utils/sendNotif");

module.exports = {
  getAll: asyncHandler(async (req, res) => {
    const messages = await db.Message.findAll({
      include: [
        { model: db.User, as: "sender", attributes: ["id"] },
        { model: db.User, as: "receiver", attributes: ["id"] },
        {
          model: db.Attatchment,
          as: "attachments",
          attributes: ["attatchment_url"],
        },
      ],
    });
    if (!messages) {
      return res.status(400).json({
        success: false,
        message: "Get all messages failed",
      });
    }

    const formattedMessage = await Promise.all(
      messages.map(async (message) => {
        const attachments = message.attachments.map(
          (item) => item.attatchment_url
        );
        return {
          ...message.toJSON(),
          attachments: attachments,
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: "Get all messages successfully",
      data: formattedMessage,
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const message = await db.Message.findByPk(id, {
      include: [
        { model: db.User, as: "sender", attributes: ["id"] },
        { model: db.User, as: "receiver", attributes: ["id"] },
        {
          model: db.Attatchment,
          as: "attachments",
          attributes: ["attatchment_url"],
        },
      ],
    });

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    const attachments = message.attachments.map(
      (media) => media.attatchment_url
    );

    const formattedMessage = {
      ...message.toJSON(),
      attachments: attachments,
    };

    return res.status(200).json({
      success: true,
      message: "Get message successfully",
      data: formattedMessage,
    });
  }),

  getByConversationId: asyncHandler(async (req, res) => {
    const { id: conversation_id } = req.params;
    const { id: userId } = req.user;
    const transaction = await db.sequelize.transaction();

    try {
      await db.Message.update(
        { is_read: true },
        {
          where: {
            conversation_id,
            receiver_id: userId,
            is_read: false,
          },
          transaction,
        }
      );

      const messages = await db.Message.findAll({
        where: { conversation_id },
        order: [["createdAt", "DESC"]],
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
          {
            model: db.Attatchment,
            as: "attachments",
            attributes: ["attatchment_url"],
          },
        ],
        transaction,
      });

      await transaction.commit();
      if (!messages) {
        return res.status(400).json({
          success: false,
          message: "Get all messages failed",
        });
      }

      const formattedMessage = await Promise.all(
        messages.map(async (message) => {
          const attachments = message.attachments.map(
            (item) => item.attatchment_url
          );
          return {
            ...message.toJSON(),
            attachments,
          };
        })
      );

      return res.status(200).json({
        success: true,
        message: "Get messages by conversation_id successfully",
        data: formattedMessage,
      });
    } catch (error) {
      await transaction.rollback();
      console.error("Error fetching messages or updating read status:", error);
      return res.status(500).json({
        success: false,
        message:
          "An error occurred while fetching messages or updating read status",
      });
    }
  }),

  create: asyncHandler(async (req, res) => {
    const { id: sender_id } = req.user;
    const { receiver_id, conversation_id, message } = req.body;
    const newMessage = await db.Message.create({
      sender_id,
      receiver_id,
      conversation_id,
      message,
      is_read: false,
      is_pin: false,
    });

    const conversation = await db.Conversation.findByPk(conversation_id);
    if (conversation) {
      conversation.last_message_id = newMessage.id;
      conversation.unread_count += 1;
      await conversation.save();
    }
    sendMessageNotif(newMessage.dataValues, sender_id, receiver_id);

    return res.status(200).json({
      success: true,
      message: "Message created successfully",
      data: newMessage,
    });
  }),

  sendAttachment: asyncHandler(async (req, res) => {
    const { id: sender_id } = req.user;
    const { media_list, ...messageData } = req.body;
    const t = await db.sequelize.transaction();
    try {
      const newMessage = await db.Message.create(
        { sender_id, ...messageData },
        { transaction: t }
      );

      if (media_list && media_list.length > 0) {
        newMessage.attachmentList = media_list;
        const attachmentPromises = media_list.map((attachment) =>
          db.Attatchment.create(
            {
              message_id: newMessage.id,
              attatchment_url: attachment,
            },
            { transaction: t }
          )
        );
        newMessage.dataValues.attachments = media_list;
        console.log(newMessage.dataValues);
        await Promise.all(attachmentPromises);
      }
      await t.commit();

      return res.status(200).json({
        success: true,
        message: "Message and Attachment created successfully",
        data: newMessage,
      });
    } catch (error) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Create Message failed",
        error: error.message,
      });
    }
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { message, is_read, is_pin, media_list } = req.body;
    const t = await db.sequelize.transaction();

    try {
      const existingMessage = await db.Message.findByPk(id, { transaction: t });

      if (!existingMessage) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      const existingAttachments = await db.Attatchment.findAll({
        where: { message_id: id },
        transaction: t,
      });
      if (existingAttachments && existingAttachments.length > 0) {
        const deletePromises = existingAttachments.map(async (attachment) => {
          const attachmentUrl = new URL(attachment.attatchment_url);
          const objectKey = attachmentUrl.pathname.substring(1);
          await bucket.deleteObject(objectKey);
          await attachment.destroy({ transaction: t });
        });
        await Promise.all(deletePromises);
      }

      await existingMessage.update(
        { message, is_read, is_pin },
        { transaction: t }
      );

      if (media_list && media_list.length > 0) {
        const attachmentPromises = media_list.map((attachmentUrl) =>
          db.Attachment.create(
            {
              message_id: existingMessage.id,
              attachment_url: attachmentUrl,
            },
            { transaction: t }
          )
        );
        await Promise.all(attachmentPromises);
      }

      await t.commit();
      return res.status(200).json({
        success: true,
        message: "Message updated successfully",
        data: existingMessage,
      });
    } catch (error) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Update message failed",
        error: error.message,
      });
    }
  }),

  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const t = await db.sequelize.transaction();

    try {
      const message = await db.Message.findByPk(id, { transaction: t });
      if (!message) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      const { conversation_id } = message;

      const existingAttachments = await db.Attatchment.findAll({
        where: { message_id: id },
        transaction: t,
      });
      if (existingAttachments && existingAttachments.length > 0) {
        const deletePromises = existingAttachments.map(async (attachment) => {
          const attachmentUrl = new URL(attachment.attatchment_url);
          const objectKey = attachmentUrl.pathname.substring(1);
          await bucket.deleteObject(objectKey);
          await attachment.destroy({ transaction: t });
        });
        await Promise.all(deletePromises);
      }

      const conversation = await db.Conversation.findByPk(conversation_id, {
        transaction: t,
      });
      const last_message_id = conversation.last_message_id;
      await message.destroy({ transaction: t });
      if (last_message_id == id) {
        const latestMessage = await db.Message.findOne({
          where: { conversation_id },
          order: [["createdAt", "DESC"]],
          transaction: t,
        });

        conversation.last_message_id = latestMessage ? latestMessage.id : null;
        await conversation.save({ transaction: t });
      }

      await t.commit();
      return res.status(200).json({
        success: true,
        message: "Message and attachments deleted successfully",
        data: message,
      });
    } catch (error) {
      await t.rollback();
      console.log(error);
      return res.status(400).json({
        success: false,
        message: "Delete message failed",
        error: error.message,
      });
    }
  }),
};
