const asyncHandler = require("express-async-handler");
const db = require("../models");
const { sendUpdateNotif } = require("../utils/sendNotif");

module.exports = {
  getAll: asyncHandler(async (req, res) => {
    const comments = await db.Comment.findAll();
    if (!comments) {
      return res.status(400).json({
        success: false,
        message: "Get all comments failed",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Get all comments successfully",
      data: comments,
    });
  }),

  getByPostId: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const comments = await db.Comment.findAll({
      where: { post_id: id },
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["id", "username", "avatar_url"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!comments) {
      return res.status(400).json({
        success: false,
        message: "Get comments by post_id failed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Get comments by post_id successfully",
      data: comments,
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const comment = await db.Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Get comment successfully",
      data: comment,
    });
  }),

  create: asyncHandler(async (req, res) => {
    const { id: senderId } = req.user;
    const { post_id, comment } = req.body;
    const newComment = await db.Comment.create({
      user_id: senderId,
      post_id,
      comment,
    });

    await db.Post.increment("total_comment", {
      by: 1,
      where: { id: post_id },
    });

    const post = await db.Post.findByPk(post_id);

    const msg = {
      message: " đã bình luận về bài viết của bạn",
      body: comment,
    };
    if (post.user_id !== senderId) {
      sendUpdateNotif(msg, senderId, post.user_id);
      await db.Notification.create({
        type: "UPDATE_POST",
        title: "đã bình luận về bài viết của bạn",
        message: comment,
        data: JSON.stringify({ post_id }),
        user_id: post.user_id,
        sender_id: senderId,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Comment created successfully",
      data: newComment,
    });
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const comment = await db.Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    await comment.update({ content });

    return res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      data: comment,
    });
  }),

  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const comment = await db.Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const post_id = comment.post_id;
    await comment.destroy();

    await db.Post.increment("total_comment", {
      by: -1,
      where: { id: post_id },
    });

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  }),
};
