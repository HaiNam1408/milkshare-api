const asyncHandler = require("express-async-handler");
const db = require("../models");

module.exports = voteController = {
  getAllUpVote: asyncHandler(async (req, res) => {
    const votes = await db.VoteQuestion.findAll();
    if (!votes) {
      return res.status(400).json({
        success: false,
        message: "Get all upvote questions failed",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Get all upvote questions successfully",
      data: votes,
    });
  }),

  voting: asyncHandler(async (req, res) => {
    const { id } = req.user;
    const { question_id, is_upvote } = req.body;
    const t = await db.sequelize.transaction();

    try {
      const existingVote = await db.VoteQuestion.findOne({
        where: {
          user_id: id,
          question_id,
        },
        transaction: t,
      });

      let voteChange = 0;

      if (existingVote) {
        if (existingVote.is_upvote !== is_upvote) {
          voteChange = is_upvote ? 1 : -1;
          existingVote.is_upvote = is_upvote;
          await existingVote.save({ transaction: t });
        }
      } else {
        await db.VoteQuestion.create(
          {
            user_id: id,
            question_id,
            is_upvote,
          },
          { transaction: t }
        );
        voteChange = is_upvote ? 1 : -1;
      }

      const question = await db.Question.findByPk(question_id, {
        transaction: t,
      });

      if (!question) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: "Question not found",
        });
      }

      question.vote += voteChange;
      await question.save({ transaction: t });

      await t.commit();

      return res.status(200).json({
        success: true,
        message: "Voting successfully",
      });
    } catch (error) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Voting failed",
        error: error.message,
      });
    }
  }),

  getVoteById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const vote = await db.VoteQuestion.findByPk(id);
    if (!vote) {
      return res.status(404).json({
        success: false,
        message: "Vote not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Vote retrieved successfully",
      data: vote,
    });
  }),

  updateVote: asyncHandler(async (req, res) => {
    const { vid } = req.params;
    const { id } = req.user;
    req.body = { ...req.body, user_id: id };
    const t = await db.sequelize.transaction();

    try {
      const vote = await db.VoteQuestion.findByPk(vid, { transaction: t });
      if (!vote) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: "Vote not found",
        });
      }

      const originalIsUpvote = vote.is_upvote;
      await vote.update(req.body, { transaction: t });

      const question = await db.Question.findByPk(req.body.question_id, {
        transaction: t,
      });
      if (!question) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: "Question not found",
        });
      }

      if (originalIsUpvote !== is_upvote) {
        if (is_upvote) {
          question.vote += 1;
        } else {
          question.vote -= 1;
        }
      }

      await question.save({ transaction: t });
      await t.commit();

      return res.status(200).json({
        success: true,
        message: "Vote updated successfully",
        data: vote,
      });
    } catch (error) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Update vote failed",
        error: error.message,
      });
    }
  }),

  deleteVote: asyncHandler(async (req, res) => {
    const { vid } = req.params;
    const t = await db.sequelize.transaction();

    try {
      const vote = await db.VoteQuestion.findByPk(vid, { transaction: t });
      if (!vote) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: "Vote not found",
        });
      }

      const question = await db.Question.findByPk(vote.question_id, {
        transaction: t,
      });
      if (!question) {
        await t.rollback();
        return res.status(404).json({
          success: false,
          message: "Question not found",
        });
      }

      question.vote += vote.is_upvote ? -1 : 1;

      await vote.destroy({ transaction: t });
      await question.save({ transaction: t });

      await t.commit();

      return res.status(200).json({
        success: true,
        message: "Vote deleted successfully",
      });
    } catch (error) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Delete vote failed",
        error: error.message,
      });
    }
  }),
};
