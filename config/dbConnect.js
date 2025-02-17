const sequelize = require("sequelize");
require("dotenv").config();

const db = new sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  timezone: "+07:00",
  port: 5432,
  logging: false,
  dialectOptions: {
    ssl: true,
  },
  define: {
    freezeTableName: true,
  },
});

const dbConnect = () => {
  db.authenticate()
    .then(() => console.log("Database connected successfully"))
    .catch((err) => console.log(err.message));
};

module.exports = dbConnect;
