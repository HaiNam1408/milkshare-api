const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role_code: user.role_code },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "365d",
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "365d",
  });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
