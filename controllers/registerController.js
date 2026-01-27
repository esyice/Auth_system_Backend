import bcrypt from "bcrypt";
import User from "../models/User.js";

const registerController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 🧩 Basic field validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔍 Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // 🔒 Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 💾 Create new user
    const newUser = new User({
      name,
      email,
      password: password,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "✅ User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("❌ Register error:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export default registerController;
