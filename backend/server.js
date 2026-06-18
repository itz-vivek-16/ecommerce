// 1. LOAD CONFIG FIRST BEFORE ANY IMPORTS
const path = require("path");
const fs=require("fs");
const configPath = path.join(__dirname, "config", "config.env");
console.log("Looking for config file at:", configPath);
console.log("Does the file exist there?:", fs.existsSync(configPath));
require("dotenv").config({ path: configPath });
console.log("Database URI from env is:", process.env.MONGO_URI);
// 2. NOW IMPORT THE REST OF THE PACKAGES
const app = require("./app");
const cloudinary = require("cloudinary");
const connectDatabase = require("./config/database");

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

// Connecting to database
connectDatabase();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server is working on http://localhost:${PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});