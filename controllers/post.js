const asyncHandler = require("express-async-handler");
const db = require("../models");

module.exports = {
  getAll: asyncHandler(async (req, res) => {
    const { id: userId } = req.user;

    const posts = await db.Post.findAll({
      include: [
        {
          model: db.PostMedia,
          as: "mediaList",
          attributes: ["media_url"],
        },
        {
          model: db.User,
          as: "user",
          attributes: ["id", "username", "avatar_url", "role_code"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!posts) {
      return res.status(400).json({
        success: false,
        message: "Get all posts failed",
      });
    }

    const formattedPosts = await Promise.all(
      posts.map(async (post) => {
        const mediaList = post.mediaList.map((media) => media.media_url);
        const isFavorite = await db.FavoritePost.findOne({
          where: { post_id: post.id, user_id: userId },
        });

        return {
          ...post.toJSON(),
          mediaList,
          is_favorite: !!isFavorite,
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: "Get all posts successfully",
      data: formattedPosts,
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const { id: userId } = req.user;
    const { id } = req.params;

    const post = await db.Post.findByPk(id, {
      include: [
        {
          model: db.PostMedia,
          as: "mediaList",
          attributes: ["media_url"],
        },
        {
          model: db.User,
          as: "user",
          attributes: ["id", "username", "avatar_url"],
        },
      ],
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const mediaList = post.mediaList.map((media) => media.media_url);
    const isFavorite = await db.FavoritePost.findOne({
      where: { post_id: id, user_id: userId },
    });

    const formattedPost = {
      ...post.toJSON(),
      mediaList,
      is_favorite: !!isFavorite,
    };

    return res.status(200).json({
      success: true,
      message: "Get post successfully",
      data: formattedPost,
    });
  }),

  create: asyncHandler(async (req, res) => {
    const { id } = req.user;
    const { content, total_favorite, total_comment, status, media_list } =
      req.body;
    const t = await db.sequelize.transaction();

    try {
      const newPost = await db.Post.create(
        {
          user_id: id,
          content,
          total_favorite,
          total_comment,
          status,
        },
        { transaction: t }
      );

      if (media_list && media_list.length > 0) {
        const mediaPromises = media_list.map((media) =>
          db.PostMedia.create(
            {
              post_id: newPost.id,
              media_url: media,
            },
            { transaction: t }
          )
        );
        await Promise.all(mediaPromises);
      }

      const user = await db.User.findByPk(id, { transaction: t });
      if (user) {
        await user.update(
          {
            post_total: user.post_total + 1,
            contribution: user.contribution + 100,
          },
          { transaction: t }
        );
      }

      await t.commit();

      return res.status(200).json({
        success: true,
        message: "Post and media created successfully",
        data: newPost,
      });
    } catch (error) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Create post failed",
        error: error.message,
      });
    }
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { content, total_favorite, total_comment, status, media_list } =
      req.body;
    const t = await db.sequelize.transaction();

    try {
      const post = await db.Post.findByPk(id, { transaction: t });
      if (!post) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }

      await post.update(
        { content, total_favorite, total_comment, status },
        { transaction: t }
      );

      await db.PostMedia.destroy({ where: { post_id: id }, transaction: t });

      if (media_list && media_list.length > 0) {
        const mediaPromises = media_list.map((media) =>
          db.PostMedia.create(
            {
              post_id: post.id,
              media_url: media,
            },
            { transaction: t }
          )
        );
        await Promise.all(mediaPromises);
      }

      await t.commit();

      return res.status(200).json({
        success: true,
        message: "Post and media updated successfully",
        data: post,
      });
    } catch (error) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Update post failed",
        error: error.message,
      });
    }
  }),

  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const t = await db.sequelize.transaction();

    try {
      const post = await db.Post.findByPk(id, { transaction: t });
      if (!post) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }

      await db.PostMedia.destroy({ where: { post_id: id }, transaction: t });

      await post.destroy({ transaction: t });

      const user = await db.User.findByPk(post.user_id, { transaction: t });
      if (user) {
        await user.update(
          {
            post_total: user.post_total - 1,
          },
          { transaction: t }
        );
      }

      await t.commit();

      return res.status(200).json({
        success: true,
        message: "Post and media deleted successfully",
      });
    } catch (error) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Delete post failed",
        error: error.message,
      });
    }
  }),
};
