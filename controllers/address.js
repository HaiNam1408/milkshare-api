const asyncHandler = require("express-async-handler");
const db = require("../models");

module.exports = {
  getAll: asyncHandler(async (req, res) => {
    const addresses = await db.Address.findAll();
    if (!addresses) {
      return res.status(400).json({
        success: false,
        message: "Get all addresses failed",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Get all addresses successfully",
      data: addresses,
    });
  }),

  create: asyncHandler(async (req, res) => {
    const { id: user_id } = req.user;
    req.body = { ...req.body, user_id };
    const address = await db.Address.create(req.body);
    const user = await db.User.findByPk(user_id);
    if (user) {
      await user.update({ address_id: address.id });
      await user.save();
    }
    if (address) {
      return res.status(200).json({
        success: true,
        message: "Address created successfully",
        data: address,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Failed to create address",
      });
    }
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const address = await db.Address.findByPk(id);
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Address found",
      data: address,
    });
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const address = await db.Address.findByPk(id);
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }
    const updatedAddress = await address.update(req.body);
    if (updatedAddress) {
      return res.status(200).json({
        success: true,
        message: "Address updated successfully",
        data: updatedAddress,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Failed to update address",
      });
    }
  }),

  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const address = await db.Address.findByPk(id);
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }
    await address.destroy();
    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  }),
};
