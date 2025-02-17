const asyncHandler = require("express-async-handler");
const db = require("../models");

module.exports = {
  getAll: asyncHandler(async (req, res) => {
    const events = await db.Event.findAll();
    if (!events) {
      return res.status(400).json({
        success: false,
        message: "Get all events failed",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Get all events successfully",
      data: events,
    });
  }),

  create: asyncHandler(async (req, res) => {
    const event = await db.Event.create(req.body);
    if (event) {
      return res.status(200).json({
        success: true,
        message: "Event created successfully",
        data: event,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Failed to create event",
      });
    }
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const event = await db.Event.findByPk(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Event found",
      data: event,
    });
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const event = await db.Event.findByPk(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }
    await event.update(req.body);
    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  }),

  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const event = await db.Event.findByPk(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }
    await event.destroy();
    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  }),
};
