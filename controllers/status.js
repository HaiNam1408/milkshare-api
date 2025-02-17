const asyncHandler = require("express-async-handler");
const db = require("../models");
const { sendUpdateNotif } = require("../utils/sendNotif");

module.exports = {
  getAll: asyncHandler(async (req, res) => {
    const { id: userId } = req.user;

    const statuses = await db.Status.findAll({
      include: [
        {
          model: db.User,
          as: "user",
          attributes: [
            "id",
            "username",
            "avatar_url",
            "average_rating",
            "location",
          ],
          include: [
            {
              model: db.Address,
              as: "address",
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!statuses) {
      return res.status(400).json({
        success: false,
        message: "Get all status failed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Get all status successfully",
      data: statuses,
    });
  }),

  create: asyncHandler(async (req, res) => {
    const { id: user_id } = req.user;
    req.body = { ...req.body, user_id };
    const status = await db.Status.create(req.body);
    if (status) {
      return res.status(200).json({
        success: true,
        message: "Status created successfully",
        data: status,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Failed to create status",
      });
    }
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const status = await db.Status.findByPk(id, {
      include: [
        {
          model: db.User,
          as: "user",
          attributes: [
            "id",
            "username",
            "avatar_url",
            "post_total",
            "contribution",
            "average_rating",
            "location",
          ],
          include: [
            {
              model: db.Address,
              as: "address",
            },
          ],
        },
      ],
    });
    if (!status) {
      return res.status(404).json({
        success: false,
        message: "Status not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Status found",
      data: status,
    });
  }),

  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const status = await db.Status.findByPk(id);
    if (!status) {
      return res.status(404).json({
        success: false,
        message: "Status not found",
      });
    }
    const updatedStatus = await status.update(req.body);
    if (updatedStatus) {
      return res.status(200).json({
        success: true,
        message: "Status updated successfully",
        data: updatedStatus,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Failed to update status",
      });
    }
  }),

  updateAcceptStatus: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { id: user_id } = req.user;
    const { isAccepted, statusAcceptId } = req.body;

    const status = await db.Status.findByPk(id);
    const statusAccept = await db.Status.findByPk(statusAcceptId);
    if (!status || !statusAccept) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy trạng thái",
      });
    }

    const updatedStatus = await status.update({
      isAccepted: isAccepted,
      acceptorId: isAccepted ? user_id : null,
    });

    if (updatedStatus) {
      if (isAccepted) {
        await db.AcceptStatus.create({
          giver_id: user_id,
          receiver_id: updatedStatus.user_id,
          status_id: statusAcceptId,
        });
      } else {
        await db.AcceptStatus.destroy({
          where: {
            giver_id: user_id,
            receiver_id: updatedStatus.user_id,
            status_id: statusAcceptId,
          },
        });
      }

      if (updatedStatus.user_id !== user_id) {
        const msg = {
          message: isAccepted
            ? " đã chấp nhận trạng thái của bạn"
            : " đã hủy chấp nhận trạng thái của bạn",
        };

        sendUpdateNotif(msg, user_id, updatedStatus.user_id);
        await db.Notification.create({
          type: "UPDATE_STATUS",
          title: msg.message,
          message: "Kiểm tra ngay",
          data: JSON.stringify({ status_id: updatedStatus.id }),
          user_id: updatedStatus.user_id,
          sender_id: user_id,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Status updated successfully",
        data: updatedStatus,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Failed to update status",
      });
    }
  }),

  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const status = await db.Status.findByPk(id);
    if (!status) {
      return res.status(404).json({
        success: false,
        message: "Status not found",
      });
    }
    await status.destroy();
    return res.status(200).json({
      success: true,
      message: "Status deleted successfully",
      data: status,
    });
  }),
};
