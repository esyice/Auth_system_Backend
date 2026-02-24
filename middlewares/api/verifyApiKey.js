import crypto from "crypto";
import ApiKey from "../../models/apis/Apikeys.js";
import { redisClient } from "../../config/redis.js"; // adjust if different

const RATE_LIMIT = 60; // 60 requests
const WINDOW = 60; // 60 seconds

const verifyApiKey = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "API key missing" });
    }

    const rawKey = authHeader.split(" ")[1];

    const tokenHash = crypto.createHash("sha256").update(rawKey).digest("hex");

    const apiKey = await ApiKey.findOne({
      tokenHash,
      active: true,
      $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
    });

    if (!apiKey) {
      return res.status(401).json({ message: "Invalid or expired API key" });
    }

    // 🔥 RATE LIMIT SECTION
    const rateKey = `rate:${apiKey._id}`;

    const current = await redisClient.incr(rateKey);

    if (current === 1) {
      // First request → set expiry
      await redisClient.expire(rateKey, WINDOW);
    }

    if (current > RATE_LIMIT) {
      return res.status(429).json({
        message: "Rate limit exceeded. Max 60 requests per minute.",
      });
    }

    req.projectOwner = apiKey.userId;
    req.projectId = apiKey._id;

    next();
  } catch (error) {
    console.error("API key verification failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default verifyApiKey;
