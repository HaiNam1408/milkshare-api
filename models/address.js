"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Address.hasMany(models.User, { foreignKey: "address_id" });
    }
  }
  Address.init(
    {
      city: DataTypes.STRING,
      district: DataTypes.STRING,
      ward: DataTypes.STRING,
      detail: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Address",
      tableName: "Addresses",
    }
  );
  return Address;
};
