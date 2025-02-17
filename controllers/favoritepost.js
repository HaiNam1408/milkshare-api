const asyncHandler = require("express-async-handler");
const db = require("../models");
const { sendUpdateNotif } = require("../utils/sendNotif");

module.exports = {
  getAll: asyncHandler(async (req, res) => {
    const favorites = await db.FavoritePost.findAll();
    if (!favorites) {
      return res.status(400).json({
        success: false,
        message: "Get all favorites failed",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Get all favorites successfully",
      data: favorites,
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const favorite = await db.FavoritePost.findByPk(id);
    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Get favorite successfully",
      data: favorite,
    });
  }),

  create: asyncHandler(async (req, res) => {
    const { id } = req.user;
    const { post_id } = req.body;
    const existingFavorite = await db.FavoritePost.findOne({
      where: { user_id: id, post_id },
    });

    if (existingFavorite) {
      await existingFavorite.destroy();
      await db.Post.increment("total_favorite", {
        by: -1,
        where: { id: post_id },
      });
      return res.status(200).json({
        success: true,
        message: "Favorite removed successfully",
      });
    }

    const favorite = await db.FavoritePost.create({
      user_id: id,
      post_id,
    });

    await db.Post.increment("total_favorite", {
      by: 1,
      where: { id: post_id },
    });

    const post = await db.Post.findByPk(post_id);

    await db.User.increment("favorite_total", {
      by: 1,
      where: { id: post.user_id },
    });

    const msg = {
      message: " đã thích bài viết của bạn",
      body: post.content,
    };
    if (post.user_id != id) {
      sendUpdateNotif(msg, id, post.user_id);
      await db.Notification.create({
        type: "UPDATE_POST",
        title: "đã thích bài viết của bạn",
        data: JSON.stringify({ post_id }),
        user_id: post.user_id,
        sender_id: id,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Favorite created successfully",
      data: favorite,
    });
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.user;
    const { fid } = req.params;
    const { user_id, post_id } = req.body;

    const favorite = await db.FavoritePost.findByPk(fid);
    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found",
      });
    }

    await favorite.update({ user_id: id, post_id });

    return res.status(200).json({
      success: true,
      message: "Favorite updated successfully",
      data: favorite,
    });
  }),

  delete: asyncHandler(async (req, res) => {
    const { fid } = req.params;

    const favorite = await db.FavoritePost.findByPk(fid);
    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found",
      });
    }

    const post_id = favorite.post_id;

    await favorite.destroy();
    await db.Post.increment("total_favorite", {
      by: -1,
      where: { id: post_id },
    });

    return res.status(200).json({
      success: true,
      message: "Favorite deleted successfully",
    });
  }),
};
