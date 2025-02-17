"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Tạo cột tạm thời
      await queryInterface.addColumn(
        "Users",
        "location_temp",
        {
          type: Sequelize.JSON,
          allowNull: true,
        },
        { transaction }
      );

      // Sao chép dữ liệu từ cột cũ sang cột tạm
      await queryInterface.sequelize.query(
        `
        UPDATE "Users"
        SET "location_temp" = to_json("location"::text)
      `,
        { transaction }
      );

      // Xóa cột cũ
      await queryInterface.removeColumn("Users", "location", { transaction });

      // Đổi tên cột tạm thành cột chính
      await queryInterface.renameColumn("Users", "location_temp", "location", {
        transaction,
      });
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Tạo lại cột tạm với kiểu dữ liệu trước khi thay đổi
      await queryInterface.addColumn(
        "Users",
        "location_temp",
        {
          type: Sequelize.TEXT, // hoặc kiểu dữ liệu cũ nếu không phải TEXT
          allowNull: true,
        },
        { transaction }
      );

      // Sao chép dữ liệu từ cột JSON trở lại cột tạm với chuyển đổi kiểu dữ liệu
      await queryInterface.sequelize.query(
        `
        UPDATE "Users"
        SET "location_temp" = ("location"->>'key')::text -- Điều chỉnh nếu cột cũ là TEXT hoặc kiểu khác
      `,
        { transaction }
      );

      // Xóa cột JSON
      await queryInterface.removeColumn("Users", "location", { transaction });

      // Đổi tên cột tạm lại thành cột chính
      await queryInterface.renameColumn("Users", "location_temp", "location", {
        transaction,
      });
    });
  },
};
