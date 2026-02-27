import { redisClient } from "../../config/redis.js";

export const getUsageByApiKey = async (apiKeyId) => {
  const today = new Date().toISOString().slice(0, 10);
  const month = new Date().toISOString().slice(0, 7);

  const [todayCount, monthCount, totalCount] = await Promise.all([
    redisClient.get(`usage:${apiKeyId}:day:${today}`),
    redisClient.get(`usage:${apiKeyId}:month:${month}`),
    redisClient.get(`usage:${apiKeyId}:total`),
  ]);

  return {
    today: Number(todayCount) || 0,
    month: Number(monthCount) || 0,
    total: Number(totalCount) || 0,
  };
};