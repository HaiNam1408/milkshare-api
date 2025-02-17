const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/dbConnect");
const initRoute = require("./routes");
require("dotenv").config();
const { initSocketServer } = require("./config/socket.io");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(cors());
app.use(logger("dev"));
dbConnect();
initRoute(app);

initSocketServer(app);
