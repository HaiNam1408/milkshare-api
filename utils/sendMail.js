const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendMail = async ({ email, html }) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: '"MiaMilkShare" <no-relply@miastudio.com>',
    to: email,
    subject: "Quên mật khẩu",
    html: html,
  });

  return info;
};

module.exports = sendMail;
