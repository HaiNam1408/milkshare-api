require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false,
    timezone: process.env.DB_TIMEZONE,
    dialectOptions: {
      ssl: process.env.DB_SSL === "true",
    },
    define: {
      freezeTableName: true,
    },
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false,
    timezone: process.env.DB_TIMEZONE,
    dialectOptions: {
      ssl: process.env.DB_SSL === "true",
    },
    define: {
      freezeTableName: true,
    },
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false,
    timezone: process.env.DB_TIMEZONE,
    dialectOptions: {
      ssl: process.env.DB_SSL === "true",
    },
    define: {
      freezeTableName: true,
    },
  },
};
