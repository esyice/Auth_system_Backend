import { redisClient } from "../../../config/redis.js";

const MAX_ATTEMPTS = 5;

const verifyOtpController = async (req, res) => {
  try {
    const flow = req.flow;
    const { type, identifier, otp } = req.body;

    if (!flow || !type || !identifier || !otp) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const otpKey = `otp:${flow}:${type}:${identifier}`;
    const raw = await redisClient.get(otpKey);

    if (!raw) {
      return res.status(400).json({
        message: "OTP expired or not requested",
      });
    }

    const stored = JSON.parse(raw);

    if (stored.attempts >= MAX_ATTEMPTS) {
      await redisClient.del(otpKey);
      return res.status(403).json({
        message: "Too many failed attempts",
      });
    }

    if (stored.otp !== otp) {
      stored.attempts += 1;

      const ttl = await redisClient.ttl(otpKey);

      if (ttl > 0) {
        await redisClient.set(otpKey, JSON.stringify(stored), {
          EX: ttl,
        });
      }

      return res.status(400).json({ message: "Invalid OTP" });
    }

    // SUCCESS
    const ttl = await redisClient.ttl(otpKey);

    await redisClient.del(otpKey);

    if (ttl > 0) {
      const verifyKey = `verify:${flow}:${type}:${identifier}`;

      await redisClient.set(verifyKey, "true", {
        EX: ttl,
      });
    }

    return res.json({
      message: `${flow} verification successful`,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default verifyOtpController;
