const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const verifyToken = asyncHandler(async (req, res, next) => {
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decode) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Invalid access token!",
        });
      }
      req.user = decode;
      next();
    });
  } else
    return res.status(401).json({
      success: false,
      message: "Require authentication!",
    });
});

const verifyAdmin = asyncHandler(async (req, res, next) => {
  const { role_code } = req.user;
  console.log(role_code);
  if (role_code == 1) {
    next();
  } else
    return res.status(401).json({
      success: false,
      message: "Require admin authentication!",
    });
});

module.exports = { verifyToken, verifyAdmin };
