const mongoose = require("mongoose");

async function connectDB() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing in environment variables");
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw error;
  }
}

module.exports = { connectDB };
