"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Message.belongsTo(models.User, {
        foreignKey: "sender_id",
        as: "sender",
      });
      Message.belongsTo(models.User, {
        foreignKey: "receiver_id",
        as: "receiver",
      });
      Message.belongsTo(models.Conversation, {
        foreignKey: "conversation_id",
        as: "conversation",
      });
      Message.hasMany(models.Attatchment, {
        foreignKey: "message_id",
        as: "attachments",
      });
    }
  }
  Message.init(
    {
      conversation_id: DataTypes.INTEGER,
      sender_id: DataTypes.INTEGER,
      receiver_id: DataTypes.INTEGER,
      is_read: DataTypes.BOOLEAN,
      message: DataTypes.TEXT,
      is_pin: DataTypes.BOOLEAN,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Message",
      tableName: "Messages",
    }
  );
  return Message;
};
