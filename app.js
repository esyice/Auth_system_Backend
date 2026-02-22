import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import global from "./routes/globalRoutes.js";

const app = express();

connectDB();

// Enable CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.168.31.48:5173",
      "http://100.85.107.120:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization" ,"X-API-Key"],
    credentials: true,
  }),
);

console.log("new crosa active");

// Middleware to parse JSON
app.use(express.json());
app.use("/api", global);

// Export the app for server.js
export default app;
