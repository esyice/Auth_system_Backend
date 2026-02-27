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

    //📊 USAGE TRACKING
    const today = new Date().toISOString().slice(0, 10);
    const month = new Date().toISOString().slice(0, 7);

    const dayKey = `usage:${apiKey._id}:day:${today}`;
    const monthKey = `usage:${apiKey._id}:month:${month}`;
    const totalKey = `usage:${apiKey._id}:total`;

    const dayCount = await redisClient.incr(dayKey);
    await redisClient.incr(monthKey);
    await redisClient.incr(totalKey);

    if (dayCount === 1) {
      await redisClient.expire(dayKey, 86400);
    }

    await redisClient.expire(monthKey, 60 * 60 * 24 * 32);

    // Attach project info to request for downstream use
    req.projectOwner = apiKey.userId;
    req.projectId = apiKey._id;

    next();
  } catch (error) {
    console.error("API key verification failed:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default verifyApiKey;
