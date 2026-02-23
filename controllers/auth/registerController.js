import bcrypt from "bcrypt";
import User from "../../models/users/User.js";
import { redisClient } from "../../config/redis.js";

const registerController = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const verifyKey = `verify:register:email:${email}`;
    const isVerified = await redisClient.get(verifyKey);

    if (!isVerified) {
      return res.status(400).json({
        message: "Email not verified",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile: mobile || null,
      emailVerified: true,
      mobileVerified: false,
    });

    await redisClient.del(verifyKey);

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default registerController;
