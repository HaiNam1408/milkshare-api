"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FavoritePost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      FavoritePost.belongsTo(models.Post, {
        foreignKey: "post_id",
        as: "post",
      });
      FavoritePost.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  FavoritePost.init(
    {
      user_id: DataTypes.INTEGER,
      post_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "FavoritePost",
      tableName: "FavoritePosts",
    }
  );
  return FavoritePost;
};
