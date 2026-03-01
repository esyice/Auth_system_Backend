import User from "../../../models/users/User.js";
import { generateOtp, storeOtp } from "../../../services/otp/otpService.js";
import { sendEmail } from "../../../services/email/emailService.js";
import { registerOtpTemplate } from "../../../services/email/templates/registerOtp.js";
import { resetOtpTemplate } from "../../../services/email/templates/resetOtp.js";

const sendOtpController = async (req, res) => {
  try {
    const flow = req.flow;
    const { type, identifier } = req.body;

    if (!flow || !type || !identifier) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Only email supported for now
    if (type !== "email") {
      return res.status(400).json({ message: "Invalid type" });
    }

    const existingUser = await User.findOne({ email: identifier });

    // 🔥 FLOW VALIDATION
    if (flow === "register") {
      if (existingUser) {
        return res.status(400).json({
          message: "User already exists",
        });
      }
    }

    if (flow === "reset") {
      if (!existingUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }
    }

    const otp = generateOtp();

    await storeOtp({ flow, type, identifier, otp });

    let template;

    if (flow === "register") {
      template = registerOtpTemplate(otp);
    } else if (flow === "reset") {
      template = resetOtpTemplate(otp);
    } else {
      return res.status(400).json({ message: "Invalid flow" });
    }

    await sendEmail({
      to: identifier,
      subject: template.subject,
      html: template.html,
    });

    return res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default sendOtpController;
