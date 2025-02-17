"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Attatchment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Attatchment.belongsTo(models.Message, {
        foreignKey: "message_id",
        as: "message",
      });
    }
  }
  Attatchment.init(
    {
      message_id: DataTypes.INTEGER,
      attatchment_url: DataTypes.STRING,
      type: DataTypes.STRING,
      filename: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Attatchment",
      tableName: "Attatchments",
    }
  );
  return Attatchment;
};
