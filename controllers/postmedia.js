const asyncHandler = require("express-async-handler");
const db = require("../models");

module.exports = {
  getAll: asyncHandler(async (req, res) => {
    const media = await db.PostMedia.findAll();
    return res.status(200).json({
      success: true,
      message: "Get all media successfully",
      data: media,
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const media = await db.PostMedia.findByPk(id);
    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Get media successfully",
      data: media,
    });
  }),

  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const t = await db.sequelize.transaction();

    try {
      const media = await db.PostMedia.findByPk(id, { transaction: t });
      if (!media) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: "Media not found",
        });
      }

      await media.destroy({ transaction: t });

      await t.commit();

      return res.status(200).json({
        success: true,
        message: "Media deleted successfully",
      });
    } catch (error) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Delete media failed",
        error: error.message,
      });
    }
  }),
};
