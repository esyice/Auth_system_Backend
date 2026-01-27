import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: ".env" });

// Use environment variable or fallback
const DB_STRING = process.env.MONGO_URI || "";

console.log("🧩 DB Connection String:", DB_STRING);

// Connect to MongoDB
const connectDB = async () => {
  try {
    mongoose.connect(DB_STRING );
    console.log(`✅ MongoDB Connected: `);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Stop the app if DB connection fails
  }
};

export default connectDB;
