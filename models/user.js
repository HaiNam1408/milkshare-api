"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Address, {
        foreignKey: "address_id",
        as: "address",
      });
      User.hasOne(models.Status, {
        foreignKey: "user_id",
        as: "status",
      });
      User.hasMany(models.Post, {
        foreignKey: "user_id",
        as: "posts",
      });
      User.hasMany(models.FavoritePost, {
        foreignKey: "user_id",
        as: "favorites",
      });
      User.hasMany(models.FavoriteStatus, {
        foreignKey: "user_id",
        as: "status_favorites",
      });
      User.hasMany(models.AcceptStatus, {
        foreignKey: "giver_id",
        as: "status_acceptions",
      });
      User.hasMany(models.Comment, {
        foreignKey: "user_id",
        as: "comments",
      });
      User.hasMany(models.Conversation, {
        foreignKey: "creator_user_id",
        as: "created_conversations",
      });
      User.hasMany(models.Conversation, {
        foreignKey: "other_user_id",
        as: "received_conversations",
      });
      User.hasMany(models.Message, {
        foreignKey: "sender_id",
        as: "sent_messages",
      });
      User.hasMany(models.Message, {
        foreignKey: "receiver_id",
        as: "received_messages",
      });
    }
  }
  User.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phone: DataTypes.STRING,
      birthday: DataTypes.STRING,
      address_id: DataTypes.STRING,
      location: DataTypes.JSON,
      medical_story: DataTypes.STRING,
      avatar_url: DataTypes.STRING,
      average_rating: DataTypes.FLOAT,
      post_total: DataTypes.INTEGER,
      favorite_total: DataTypes.INTEGER,
      contribution: DataTypes.INTEGER,
      volumn_total: DataTypes.FLOAT,
      role_code: DataTypes.STRING,
      refresh_token: DataTypes.STRING,
      device_key: DataTypes.STRING,
      resetPasswordCode: DataTypes.STRING,
      resetPasswordCodeExpires: DataTypes.DATE,
      ggId: DataTypes.STRING,
      fbId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
    }
  );
  return User;
};
