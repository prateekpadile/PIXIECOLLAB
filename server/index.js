const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught Exception 🔥🔥 Shutting down");
  process.exit(1);
});

// Load environment variables
console.log("Current directory:", __dirname);
dotenv.config({ path: path.resolve(__dirname, ".env") });
console.log("DATABASE =", process.env.DATABASE);
console.log("DATABASE_PASSWORD =", process.env.DATABASE_PASSWORD);

const app = require("./app");

// MongoDB connection
const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);
mongoose.connect(DB)
  .then(() => console.log("✅ DB connection established"))
  .catch(err => console.error("❌ DB connection error:", err));

app.use(cors());

const port = process.env.PORT || 5501;
const server = app.listen(port, () => {
  console.log(`🚀 Server Listening on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled rejection 🔥🔥 Shutting down");
  server.close(() => process.exit(1));
});
