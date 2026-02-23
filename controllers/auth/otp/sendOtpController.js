import { redisClient } from "../../../config/redis.js";

const sendOtpController = async (req, res) => {
  try {
    const flow = req.flow;
    const { type, identifier } = req.body;

    if (!flow || !type || !identifier) {
      return res.status(400).json({
        message: "Missing fields",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const redisKey = `otp:${flow}:${type}:${identifier}`;

    await redisClient.set(redisKey, JSON.stringify({ otp, attempts: 0 }), {
      EX: 300,
    });

    console.log("OTP:", otp);

    return res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "Server error" });
  }
};

export default sendOtpController;
