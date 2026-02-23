import { redisClient } from "../config/redis.js";

/**
 * Store value with expiry
 */
export const setWithExpiry = async (key, value, expiryInSeconds) => {
  await redisClient.set(key, JSON.stringify(value), {
    EX: expiryInSeconds,
  });
};

/**
 * Get value
 */
export const getValue = async (key) => {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};

/**
 * Delete key
 */
export const deleteKey = async (key) => {
  await redisClient.del(key);
};

/**
 * Check if key exists
 */
export const keyExists = async (key) => {
  return await redisClient.exists(key);
};
