require("dotenv").config();
const jwt = require("jsonwebtoken");

const getTokenPayload = (token) => jwt.verify(token, env("APP_SECRET"));

const getUserId = (req, authToken) => {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      if (!token) {
        throw new Error("No token found");
      }
      const { userId } = getTokenPayload(token);
      return userId;
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    return userId;
  }

  throw new Error("Not authenticated");
};

const env = (key, defaultValue = null) => {
  let value = process.env[key];

  if (defaultValue !== null) {
    value = defaultValue;
  }

  return value;
};

module.exports = {
  getUserId,
  env,
};
