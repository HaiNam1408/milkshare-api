const asyncHandler = require("express-async-handler");
const db = require("../models");
const { sendUpdateNotif } = require("../utils/sendNotif");

module.exports = {
  getAll: asyncHandler(async (req, res) => {
    const questions = await db.Question.findAll();
    if (!questions) {
      return res.status(400).json({
        success: false,
        message: "Get all questions failed",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Get all questions successfully",
      data: questions,
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const questionId = req.params.id;
    const question = await db.Question.findByPk(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Get question successfully",
      data: question,
    });
  }),

  create: asyncHandler(async (req, res) => {
    const { id } = req.user;
    const data = {
      ...req.body,
      user_id: id,
    };
    const newQuestion = await db.Question.create(data);
    if (!newQuestion) {
      return res.status(400).json({
        success: false,
        message: "Create question failed",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Create question successfully",
      data: newQuestion,
    });
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.user;
    const questionId = req.params.id;
    const updates = { ...req.body };

    const question = await db.Question.findByPk(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    await question.update(updates);
    const msg = {
      message: " đã trả lời câu hỏi của bạn",
      body: question.answer,
    };
    if (question.user_id !== id) {
      sendUpdateNotif(msg, id, question.user_id);
      await db.Notification.create({
        type: "UPDATE_QUESTION",
        title: "đã trả lời câu hỏi của bạn",
        data: JSON.stringify({ question_id: questionId }),
        message: question.answer,
        user_id: question.user_id,
        sender_id: id,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Update question successfully",
      data: question,
    });
  }),

  delete: asyncHandler(async (req, res) => {
    const questionId = req.params.id;

    const question = await db.Question.findByPk(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    await question.destroy();

    return res.status(200).json({
      success: true,
      message: "Delete question successfully",
    });
  }),

  getAllNewestQuestion: asyncHandler(async (req, res) => {
    const questions = await db.Question.findAll({
      order: [["createdAt", "DESC"]],
    });
    if (!questions) {
      return res.status(400).json({
        success: false,
        message: "Get all newest questions failed",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Get all newest questions successfully",
      data: questions,
    });
  }),

  getHotQuestions: asyncHandler(async (req, res) => {
    const questions = await db.Question.findAll({
      order: [["vote", "DESC"]],
    });
    if (!questions) {
      return res.status(400).json({
        success: false,
        message: "Get all hot questions failed",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Get all hot questions successfully",
      data: questions,
    });
  }),

  getByUserId: asyncHandler(async (req, res) => {
    const userId = req.params.uid;
    const questions = await db.Question.findAll({
      where: { user_id: userId },
    });
    if (!questions) {
      return res.status(400).json({
        success: false,
        message: "Get questions by user ID failed",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Get questions by user ID successfully",
      data: questions,
    });
  }),
};
