import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import global from "./routes/globalRoutes.js";
import { connectRedis } from "./config/redis.js";

const app = express();

connectDB();
connectRedis();

app.use(express.json());

// ✅ 1. Public CORS for external API
app.use(
  "/api/v1",
  cors({
    origin: "*", // allow anywhere
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
  }),
);

// ✅ 2. Restricted CORS for internal routes
app.use(
  "/api",
  cors({
    origin: [
      "http://localhost:5173",
      "http://192.168.31.48:5173",
      "http://100.85.107.120:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
  }),
);

app.use("/api", global);

export default app;
