const admin = require("../config/firebase.config");
const db = require("../models");

const sendMessageNotif = async (msg, senderId, receiverId) => {
  try {
    const receiver = await db.User.findByPk(receiverId);
    const sender = await db.User.findByPk(senderId);
    if (!receiver || !sender) return;
    const token = receiver.device_key;
    if (!token) return;
    const message = {
      notification: {
        title: `Bạn có tin nhắn mới từ ${sender.username}`,
        body: msg.message,
      },
      token: token,
      data: {
        type: "MESSAGE",
        conversationId: msg.conversation_id.toString(),
        participant: JSON.stringify(sender.dataValues),
      },
      android: {
        notification: {
          image: sender.avatar_url,
        },
      },
      apns: {
        payload: {
          aps: {
            "mutable-content": 1,
            alert: {
              title: `Bạn có tin nhắn mới từ ${sender.username}`,
              body: msg.message,
            },
          },
        },
      },
    };

    const response = await admin.messaging().send(message);
    if (response.success) console.log("Gửi tin nhắn thành công");
    else console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const sendUpdateNotif = async (msg, senderId, receiverId) => {
  try {
    const receiver = await db.User.findByPk(receiverId);
    const sender = await db.User.findByPk(senderId);
    if (!receiver || !sender) return;
    const token = receiver.device_key;
    if (token == null) return;
    const message = {
      notification: {
        title: sender.username + msg.message,
        body: msg.body,
      },
      token: token,
      data: {
        type: "UPDATE",
      },
      apns: {
        payload: {
          aps: {
            "mutable-content": 1,
            alert: {
              title: `Bạn có tin nhắn mới từ ${sender.username}`,
              body: msg.message,
            },
          },
        },
      },
    };

    const response = await admin.messaging().send(message);
    return response;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendMessageNotif, sendUpdateNotif };
