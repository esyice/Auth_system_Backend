import { redisClient } from "../../config/redis.js";

export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const storeOtp = async ({ flow, type, identifier, otp }) => {
  const redisKey = `otp:${flow}:${type}:${identifier}`;

  await redisClient.set(redisKey, JSON.stringify({ otp, attempts: 0 }), {
    EX: 300,
  });
};
