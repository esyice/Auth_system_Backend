import bcrypt from "bcrypt";
import User from "../../models/users/User.js";
import { redisClient } from "../../config/redis.js";
import { sendEmail } from "../../services/email/emailService.js";
import { resetSuccessTemplate } from "../../services/email/templates/resetSuccess.js";

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const { subject, html } = resetSuccessTemplate();

    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email and new password required",
      });
    }

    const verifyKey = `verify:reset:email:${email}`;
    const isVerified = await redisClient.get(verifyKey);

    if (!isVerified) {
      return res.status(400).json({
        message: "OTP verification required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await redisClient.del(verifyKey);

    // Send password reset success email
    await sendEmail({
      to: user.email,
      subject,
      html,
    });

    return res.json({
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default resetPassword;
