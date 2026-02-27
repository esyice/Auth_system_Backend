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

    const otp = generateOtp();

    await storeOtp({ flow, type, identifier, otp });

    let template;

    if (flow === "register") {
      template = registerOtpTemplate(otp);
    } else if (flow === "reset") {
      template = resetOtpTemplate(otp);
    }

    await sendEmail({
      to: identifier,
      subject: template.subject,
      html: template.html,
    });

    return res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default sendOtpController;
