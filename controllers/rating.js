const asyncHandler = require("express-async-handler");
const db = require("../models");

module.exports = {
  getAll: asyncHandler(async (req, res) => {
    const ratings = await db.Rating.findAll();
    if (!ratings) {
      return res.status(400).json({
        success: false,
        message: "Get all ratings failed",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Get all ratings successfully",
      data: ratings,
    });
  }),

  create: asyncHandler(async (req, res) => {
    const { id: user_id } = req.user;
    req.body = { ...req.body, user_id };

    const rating = await db.Rating.create(req.body);
    if (!rating) {
      return res.status(400).json({
        success: false,
        message: "Failed to create rating",
      });
    }

    const { recipient_id, star } = req.body;
    try {
      const ratings = await db.Rating.findAll({
        where: { recipient_id },
        attributes: ["star"],
      });

      const totalStars = ratings.reduce((sum, r) => sum + r.star, 0);
      const averageRating = totalStars / ratings.length;

      await db.User.update(
        { average_rating: averageRating },
        { where: { id: recipient_id } }
      );

      return res.status(200).json({
        success: true,
        message: "Rating created and average rating updated successfully",
        data: rating,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error updating average rating",
        error: error.message,
      });
    }
  }),

  getByUserId: asyncHandler(async (req, res) => {
    const { id: user_id } = req.params;
    const ratings = await db.Rating.findAll({
      where: { recipient_id: user_id },
    });
    if (!ratings) {
      return res.status(404).json({
        success: false,
        message: "Ratings not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Ratings found",
      data: ratings,
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const rating = await db.Rating.findByPk(id);
    if (!rating) {
      return res.status(404).json({
        success: false,
        message: "Rating not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Rating found",
      data: rating,
    });
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const rating = await db.Rating.findByPk(id);
    if (!rating) {
      return res.status(404).json({
        success: false,
        message: "Rating not found",
      });
    }
    await rating.update(req.body);
    return res.status(200).json({
      success: true,
      message: "Rating updated successfully",
      data: rating,
    });
  }),

  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const rating = await db.Rating.findByPk(id);
    if (!rating) {
      return res.status(404).json({
        success: false,
        message: "Rating not found",
      });
    }
    await rating.destroy();
    return res.status(200).json({
      success: true,
      message: "Rating deleted successfully",
    });
  }),
};
