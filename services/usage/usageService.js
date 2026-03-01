import { redisClient } from "../../config/redis.js";
import Usage from "../../models/Usage.js";

export const getUsageByApiKey = async (apiKeyId) => {
  const today = new Date().toISOString().slice(0, 10);
  const dayKey = `usage:${apiKeyId}:day:${today}`;

  // 1️⃣ Get today's usage from Redis
  const todayCount = await redisClient.get(dayKey);

  // 2️⃣ Get month + total from Mongo
  const usage = await Usage.findOne({ apiKeyId }).lean();

  return {
    today: Number(todayCount) || 0,
    month: usage?.month || 0,
    total: usage?.total || 0,
  };
};
