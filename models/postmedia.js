"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PostMedia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PostMedia.belongsTo(models.Post, {
        foreignKey: "post_id",
        as: "post",
      });
    }
  }
  PostMedia.init(
    {
      post_id: DataTypes.INTEGER,
      media_url: DataTypes.STRING,
      file_name: DataTypes.STRING,
      type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "PostMedia",
      tableName: "PostMedia",
    }
  );
  return PostMedia;
};
