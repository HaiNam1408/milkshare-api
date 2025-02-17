"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class VoteQuestion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  VoteQuestion.init(
    {
      user_id: DataTypes.INTEGER,
      question_id: DataTypes.INTEGER,
      is_upvote: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "VoteQuestion",
      tableName: "VoteQuestions",
    }
  );
  return VoteQuestion;
};
