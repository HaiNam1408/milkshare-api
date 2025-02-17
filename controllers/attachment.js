const asyncHandler = require("express-async-handler");
const db = require("../models");
const { bucket } = require("../config/cloudflare.config");

module.exports = {
  getAll: asyncHandler(async (req, res) => {
    const attachments = await db.Attatchment.findAll();
    if (!attachments) {
      return res.status(400).json({
        success: false,
        message: "Get all comments failed",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Get all comments successfully",
      data: attachments,
    });
  }),

  create: asyncHandler(async (req, res) => {
    try {
      const newAttachment = await db.Attatchment.create(req.body);
      return res.status(200).json({
        success: true,
        message: "Attachment created successfully",
        data: newAttachment,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to create attachment",
        error: error.message,
      });
    }
  }),

  update: asyncHandler(async (req, res) => {
    try {
      const { id, ...updateFields } = req.body;
      const attachmentToUpdate = await db.Attatchment.findByPk(id);
      if (!attachmentToUpdate) {
        return res.status(404).json({
          success: false,
          message: "Attachment not found",
        });
      }

      const updatedAttachment = await attachmentToUpdate.update(updateFields);
      return res.status(200).json({
        success: true,
        message: "Attachment updated successfully",
        data: updatedAttachment,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to update attachment",
        error: error.message,
      });
    }
  }),

  delete: asyncHandler(async (req, res) => {
    try {
      const { attatchment_url } = req.body;
      const attachmentToDelete = await db.Attatchment.findOne({
        where: { attatchment_url },
      });
      if (!attachmentToDelete) {
        return res.status(404).json({
          success: false,
          message: "Attachment not found",
        });
      }

      const message = await db.Message.findByPk(attachmentToDelete.message_id, {
        include: [
          {
            model: db.Attatchment,
            as: "attachments",
            attributes: ["attatchment_url"],
          },
        ],
      });
      if (message && message.attachments.length == 1 && message.message == "") {
        await message.destroy();
      }

      const attachmentUrl = new URL(attatchment_url);
      const objectKey = attachmentUrl.pathname.substring(1);
      await bucket.deleteObject(objectKey);

      await attachmentToDelete.destroy();
      return res.status(200).json({
        success: true,
        message: "Attachment deleted successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Failed to delete attachment",
        error: error.message,
      });
    }
  }),
};
