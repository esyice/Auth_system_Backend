import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/users/User.js";
import dotenv from "dotenv";
import LoginActivity from "../../models/users/LoginActivity.js";
import geoip from "geoip-lite";

// Load environment variables from .env file
dotenv.config({ path: ".env" });

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // 3. Check account status (CORRECT & SAFE)
    if (user.accountStatus === false) {
      return res.status(403).json({
        success: false,
        code: "ACCOUNT_DEACTIVATED",
        message: "Account is deactivated. Contact admin.",
      });
    }

    const validate = email === user.email && password === user.password;
    if (!validate) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    // get geo location
    const geo = geoip.lookup(req.ip);

    // Successful login → store activity
    await LoginActivity.create({
      userId: user._id,
      status: "SUCCESS",
      conuntry: geo ? geo.country : "Unknown",
      city: geo ? geo.city : "Unknown",
    });

    // Compare passwords
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(400).json({ success: false, message: "Invalid password" });
    // }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Login success response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default loginController;
