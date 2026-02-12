import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/users/User.js";
import dotenv from "dotenv";
import LoginActivity from "../../models/users/LoginActivity.js";
import geoip from "geoip-lite";

dotenv.config({ path: ".env" });

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    /* =========================================================
       1️⃣ BASIC VALIDATION
    ========================================================== */
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    /* =========================================================
       2️⃣ FIND USER
    ========================================================== */
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    /* =========================================================
       3️⃣ CHECK ACCOUNT STATUS
    ========================================================== */
    if (user.accountStatus === false) {
      return res.status(403).json({
        success: false,
        code: "ACCOUNT_DEACTIVATED",
        message: "Account is deactivated. Contact admin.",
      });
    }

    /* =========================================================
       4️⃣ CHECK EMAIL VERIFICATION
       (IMPORTANT SECURITY CHECK)
    ========================================================== */
    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Email not verified",
      });
    }

    /* =========================================================
       5️⃣ COMPARE PASSWORD USING BCRYPT
       (NEVER compare plain passwords)
    ========================================================== */
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    /* =========================================================
       6️⃣ GEO LOCATION
    ========================================================== */
    const geo = geoip.lookup(req.ip);

    await LoginActivity.create({
      userId: user._id,
      status: "SUCCESS",
      country: geo ? geo.country : "Unknown",
      city: geo ? geo.city : "Unknown",
      ip: req.ip,
    });

    /* =========================================================
       7️⃣ GENERATE JWT TOKEN
    ========================================================== */
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    /* =========================================================
       8️⃣ RETURN SUCCESS RESPONSE
    ========================================================== */
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default loginController;
