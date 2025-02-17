const asyncHandler = require("express-async-handler");
const db = require("../models");

module.exports = {
  create: asyncHandler(async (req, res) => {
    const { giver_id, receiver_id, status_id, is_done } = req.body;

    if (giver_id == null || receiver_id == null || status_id == null) {
      return res.status(400).json({
        success: false,
        message: "All fields except is_done are required",
      });
    }

    const newAcceptStatus = await db.AcceptStatus.create({
      giver_id,
      receiver_id,
      status_id,
      is_done,
    });
    return res.status(200).json({
      success: true,
      message: "Accept status created successfully",
      data: newAcceptStatus,
    });
  }),

  getAll: asyncHandler(async (req, res) => {
    const acceptStatuses = await db.AcceptStatus.findAll();
    return res.status(200).json({
      success: true,
      message: "Get all accept statuses successfully",
      data: acceptStatuses,
    });
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const acceptStatus = await db.AcceptStatus.findByPk(id);

    if (!acceptStatus) {
      return res.status(404).json({
        success: false,
        message: "Accept status not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Get accept status successfully",
      data: acceptStatus,
    });
  }),

  getByStatusId: asyncHandler(async (req, res) => {
    const { id: receiver_id } = req.params;

    const acceptions = await db.AcceptStatus.findAll({
      where: { receiver_id },
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

    if (!acceptions || acceptions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Accept status not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Get accept status successfully",
      data: acceptions,
    });
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { giver_id, receiver_id, status_id, is_done } = req.body;

    const acceptStatus = await db.AcceptStatus.findByPk(id);

    if (!acceptStatus) {
      return res.status(404).json({
        success: false,
        message: "Accept status not found",
      });
    }

    acceptStatus.giver_id =
      giver_id !== undefined ? giver_id : acceptStatus.giver_id;
    acceptStatus.receiver_id =
      receiver_id !== undefined ? receiver_id : acceptStatus.receiver_id;
    acceptStatus.status_id =
      status_id !== undefined ? status_id : acceptStatus.status_id;
    acceptStatus.is_done =
      is_done !== undefined ? is_done : acceptStatus.is_done;

    await acceptStatus.save();

    try {
      if (is_done) {
        const status = await db.Status.findByPk(acceptStatus.status_id);
        const giver = await db.User.findByPk(acceptStatus.giver_id);

        if (status && giver) {
          await giver.update({
            volumn_total: giver.volumn_total + status.volumn,
            contribution: giver.contribution + 500,
          });
        } else {
          if (!status) console.log(`Status with ID ${status_id} not found`);
          if (!giver) console.log(`Giver with ID ${giver_id} not found`);
        }
      }
    } catch (error) {
      console.log(error);
    }
    return res.status(200).json({
      success: true,
      message: "Accept status updated successfully",
      data: acceptStatus,
    });
  }),

  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const acceptStatus = await db.AcceptStatus.findByPk(id);

    if (!acceptStatus) {
      return res.status(404).json({
        success: false,
        message: "Accept status not found",
      });
    }

    await acceptStatus.destroy();

    return res.status(200).json({
      success: true,
      message: "Accept status deleted successfully",
    });
  }),
};
