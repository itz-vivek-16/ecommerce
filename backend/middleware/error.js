const ErrorHandler = require("../utils/errorhander");

module.exports = (err, req, res, next) => {
  // Log the real error to your VS Code terminal
  console.log("=== ACTUAL BACKEND ERROR ===", err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Wrong Mongodb Id error
  if (err.name === "CastError") {
    message = `Resource not found. Invalid: ${err.path}`;
    statusCode = 400;
  }

  // ✅ Mongoose duplicate key error (This is what triggered)
  if (err.code === 11000) {
    message = `Duplicate ${Object.keys(err.keyValue || {})} Entered`;
    statusCode = 400;
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    message = `Json Web Token is invalid, Try again`;
    statusCode = 400;
  }

  // JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    message = `Json Web Token is Expired, Try again`;
    statusCode = 400;
  }

  res.status(Number(statusCode) || 500).json({
    success: false,
    message: message,
  });
};