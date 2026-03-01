import jwt from "jsonwebtoken";
import { redisClient } from "../../config/redis.js";

const logoutController = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Calculate remaining TTL in seconds
        const currentTime = Math.floor(Date.now() / 1000);
        const ttl = decoded.exp - currentTime;

        if (ttl > 0) {
          // Store token in Redis blacklist with expiry
          await redisClient.set(`blacklist:${token}`, "true", { EX: ttl });
        }
      } catch (err) {
        console.warn("Logout token decode failed:", err.message);
        // Do NOT block logout
      }
    }

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error("Logout error:", err);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  }
};

export default logoutController;
