"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AcceptStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      AcceptStatus.belongsTo(models.Status, {
        foreignKey: "status_id",
        as: "status",
      });
      AcceptStatus.belongsTo(models.User, {
        foreignKey: "giver_id",
        as: "user",
      });
    }
  }
  AcceptStatus.init(
    {
      giver_id: DataTypes.INTEGER,
      receiver_id: DataTypes.INTEGER,
      status_id: DataTypes.INTEGER,
      is_done: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "AcceptStatus",
      tableName: "AcceptStatuses",
    }
  );
  return AcceptStatus;
};
