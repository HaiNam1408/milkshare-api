"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Conversation.belongsTo(models.User, {
        foreignKey: "creator_user_id",
        as: "creator_user",
      });
      Conversation.belongsTo(models.User, {
        foreignKey: "other_user_id",
        as: "other_user",
      });
      Conversation.hasMany(models.Message, {
        foreignKey: "conversation_id",
        as: "messages",
      });
      Conversation.belongsTo(models.Message, {
        foreignKey: "last_message_id",
        as: "last_message",
      });
    }
  }
  Conversation.init(
    {
      creator_user_id: DataTypes.INTEGER,
      other_user_id: DataTypes.INTEGER,
      last_message_id: DataTypes.INTEGER,
      unread_count: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Conversation",
      tableName: "Conversations",
    }
  );
  return Conversation;
};
