"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FavoriteStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      FavoriteStatus.belongsTo(models.Status, {
        foreignKey: "status_id",
        as: "status",
      });
      FavoriteStatus.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  FavoriteStatus.init(
    {
      user_id: DataTypes.INTEGER,
      status_id: DataTypes.INTEGER,
      is_accept: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "FavoriteStatus",
      tableName: "FavoriteStatuses",
    }
  );
  return FavoriteStatus;
};
