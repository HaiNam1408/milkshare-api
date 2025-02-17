const asyncHandler = require("express-async-handler");
const db = require("../models");
const { sendUpdateNotif } = require("../utils/sendNotif");

module.exports = {
  getAll: asyncHandler(async (req, res) => {
    const favorites = await db.FavoriteStatus.findAll({
      include: [
        {
          model: db.Status,
          as: "status",
          attributes: ["id"],
          include: [
            {
              model: db.User,
              as: "user",
              attributes: ["id", "username", "avatar_url", "location"],
              include: [
                {
                  model: db.Address,
                  as: "address",
                },
              ],
            },
          ],
        },
      ],
    });
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
    const favorite = await db.FavoriteStatus.findByPk(id, {
      include: [
        {
          model: db.Status,
          as: "status",
          attributes: ["id"],
          include: [
            {
              model: db.User,
              as: "user",
              attributes: ["id", "username", "avatar_url", "location"],
              include: [
                {
                  model: db.Address,
                  as: "address",
                },
              ],
            },
          ],
        },
      ],
    });
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

  getByStatusId: asyncHandler(async (req, res) => {
    const { id: status_id } = req.params;

    const favorite = await db.FavoriteStatus.findAll({
      where: { status_id },
      include: [
        {
          model: db.User,
          as: "user",
          attributes: [
            "id",
            "username",
            "avatar_url",
            "location",
            "volumn_total",
            "favorite_total",
            "average_rating",
          ],
          include: [
            {
              model: db.Address,
              as: "address",
            },
            {
              model: db.Status,
              as: "status",
            },
          ],
        },
      ],
    });

    if (!favorite || favorite.length === 0) {
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

  getByUserId: asyncHandler(async (req, res) => {
    const { id: user_id } = req.user;

    const favorite = await db.FavoriteStatus.findAll({
      where: { user_id },
    });

    if (!favorite || favorite.length === 0) {
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
    const { id: user_id } = req.user;
    const { status_id } = req.body;
    const existingFavorite = await db.FavoriteStatus.findOne({
      where: { user_id, status_id },
    });

    const status = await db.Status.findByPk(status_id);

    if (existingFavorite) {
      await existingFavorite.destroy();
      await db.Status.increment("favorite", {
        by: -1,
        where: { id: status_id },
      });

      const msg = {
        message: " đã hủy thích trạng thái của bạn",
      };
      if (status.user_id !== user_id) {
        sendUpdateNotif(msg, user_id, status.user_id);
        await db.Notification.create({
          type: "UPDATE_STATUS",
          title: "đã hủy thích trạng thái của bạn",
          message: "Kiểm tra ngay",
          data: JSON.stringify({ status_id }),
          user_id: status.user_id,
          sender_id: user_id,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Hủy thích thành công",
      });
    }

    const favorite = await db.FavoriteStatus.create({
      user_id,
      status_id,
    });

    await db.Status.increment("favorite", {
      by: 1,
      where: { id: status_id },
    });

    await db.User.increment("favorite_total", {
      by: 1,
      where: { id: status.user_id },
    });

    const msg = {
      message: " đã thích trạng thái của bạn",
    };
    if (status.user_id !== user_id) {
      sendUpdateNotif(msg, user_id, status.user_id);
      await db.Notification.create({
        type: "UPDATE_STATUS",
        title: "đã thích trạng thái của bạn",
        message: "Kiểm tra ngay",
        data: JSON.stringify({ status_id }),
        user_id: status.user_id,
        sender_id: user_id,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Thích trạng thái thành công",
      data: favorite,
    });
  }),

  update: asyncHandler(async (req, res) => {
    const { id: user_id } = req.user;
    const { fid } = req.params;
    const { status_id } = req.body;

    const favorite = await db.FavoriteStatus.findByPk(fid);
    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found",
      });
    }

    await favorite.update({ user_id, status_id });

    return res.status(200).json({
      success: true,
      message: "Favorite updated successfully",
      data: favorite,
    });
  }),

  delete: asyncHandler(async (req, res) => {
    const { fid } = req.params;

    const favorite = await db.FavoriteStatus.findByPk(fid);
    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Favorite not found",
      });
    }

    const status_id = favorite.status_id;

    await favorite.destroy();
    await db.Post.increment("favorite", {
      by: -1,
      where: { id: status_id },
    });

    return res.status(200).json({
      success: true,
      message: "Favorite deleted successfully",
    });
  }),
};
