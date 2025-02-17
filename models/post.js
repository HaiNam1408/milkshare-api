"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Post.hasMany(models.Comment, {
        foreignKey: "post_id",
        as: "comments",
      });
      Post.hasMany(models.FavoritePost, {
        foreignKey: "post_id",
        as: "favorites",
      });
      Post.hasMany(models.PostMedia, {
        foreignKey: "post_id",
        as: "mediaList",
      });
      Post.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  Post.init(
    {
      user_id: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      total_favorite: DataTypes.INTEGER,
      total_comment: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Post",
      tableName: "Posts",
    }
  );
  return Post;
};
