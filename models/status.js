"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Status extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Status.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
      Status.belongsToMany(models.User, {
        through: models.FavoriteStatus,
        as: "likedByUsers",
        foreignKey: "status_id",
        otherKey: "user_id",
      });
      Status.hasMany(models.FavoriteStatus, {
        foreignKey: "status_id",
        as: "favorites",
      });
      Status.hasMany(models.AcceptStatus, {
        foreignKey: "status_id",
        as: "acceptions",
      });
    }
  }
  Status.init(
    {
      user_id: DataTypes.INTEGER,
      volumn: DataTypes.INTEGER,
      favorite: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
      isAccepted: DataTypes.BOOLEAN,
      acceptorId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Status",
      tableName: "Statuses",
    }
  );
  return Status;
};
