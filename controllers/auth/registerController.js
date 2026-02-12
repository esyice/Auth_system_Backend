import bcrypt from "bcrypt";
import User from "../../models/users/User.js";
import OtpVerification from "../../models/verification/OtpVerification.js";

const registerController = async (req, res) => {
  // console.log("Register endpoint hit");

  try {
    const { name, email, password, mobile } = req.body;

    /* =========================================================
       1️⃣ BASIC VALIDATION
    ========================================================== */
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    /* =========================================================
       2️⃣ CHECK IF USER ALREADY EXISTS
       (Prevents duplicate accounts)
    ========================================================== */
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    /* =========================================================
       3️⃣ VERIFY EMAIL WAS CONFIRMED VIA OTP
       (We check temporary OTP collection)
    ========================================================== */
    const verification = await OtpVerification.findOne({
      type: "email",
      identifier: email,
      isVerified: true,
    });

    if (!verification) {
      return res.status(400).json({
        message: "Email not verified",
      });
    }

    /* =========================================================
       4️⃣ HASH PASSWORD (NEVER STORE PLAIN PASSWORD)
    ========================================================== */
    const hashedPassword = await bcrypt.hash(password, 10);

    /* =========================================================
       5️⃣ CREATE USER
       We permanently mark emailVerified = true
       because OTP already validated it
    ========================================================== */
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword, // 🔥 FIXED (was saving plain password before)
      mobile: mobile || null,
      emailVerified: true, // 🔥 Important permanent flag
      mobileVerified: false,
    });

    /* =========================================================
       6️⃣ DELETE OTP RECORD
       (OTP collection is temporary only)
    ========================================================== */
    await OtpVerification.deleteOne({
      type: "email",
      identifier: email,
    });

    /* =========================================================
       7️⃣ RETURN SUCCESS RESPONSE
    ========================================================== */
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        emailVerified: newUser.emailVerified,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default registerController;
