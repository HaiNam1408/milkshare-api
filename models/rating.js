"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Rating.init(
    {
      user_id: DataTypes.INTEGER,
      recipient_id: DataTypes.INTEGER,
      star: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Rating",
      tableName: "Ratings",
    }
  );
  return Rating;
};
