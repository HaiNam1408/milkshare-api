"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Comment.belongsTo(models.Post, {
        foreignKey: "post_id",
        as: "post",
      });
      Comment.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  Comment.init(
    {
      user_id: DataTypes.INTEGER,
      post_id: DataTypes.INTEGER,
      comment: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Comment",
      tableName: "Comments",
    }
  );
  return Comment;
};
