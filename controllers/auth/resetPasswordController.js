import bcrypt from "bcrypt";
import User from "../../models/users/User.js";
import OtpVerification from "../../models/verification/OtpVerification.js";

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // 🧩 Basic field validation
    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email and new password are required",
      });
    }

    // 🔍 Check if OTP verification exists and is valid
    const verification = await OtpVerification.findOne({
      type: "email",
      identifier: email,
      isVerified: true,
    });

    if (!verification) {
      return res.status(400).json({
        message: "OTP verification required",
      });
    }

    // 🔒 Update user's password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 🔒 Hash the new password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // 🧹 Clean up OTP record
    await OtpVerification.deleteOne({
      type: "email",
      identifier: email,
    });

    // ✅ Respond with success
    return res.json({
      message: "Password reset successful",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export default resetPassword;
