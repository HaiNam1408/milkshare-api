"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        type: Sequelize.STRING,
        required: true,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        required: true,
      },
      password: {
        type: Sequelize.STRING,
        required: true,
      },
      phone: {
        type: Sequelize.STRING,
        unique: true,
        required: true,
      },
      birthday: {
        type: Sequelize.DATE,
      },
      address_id: {
        type: Sequelize.Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Addresses",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      location: {
        type: Sequelize.STRING,
      },
      medical_story: {
        type: Sequelize.STRING,
      },
      avatar_url: {
        type: Sequelize.STRING,
      },
      average_rating: {
        type: Sequelize.FLOAT,
      },
      post_total: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      favorite_total: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      contribution: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      volumn_total: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      role_code: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Roles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        defaultValue: 4,
      },
      refresh_token: {
        type: Sequelize.STRING,
      },
      device_key: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: "TIMESTAMP",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
