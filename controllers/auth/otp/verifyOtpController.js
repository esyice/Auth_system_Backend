import OtpVerification from "../../../models/verification/OtpVerification.js";

const verifyOtpController = async (req, res) => {
  // console.log("verify otp");

  try {
    const { type, identifier, otp } = req.body;

    if (!type || !identifier || !otp) {
      return res.status(400).json({
        message: "Missing fields",
      });
    }

    const record = await OtpVerification.findOne({ type, identifier });

    if (!record) {
      return res.status(400).json({
        message: "No OTP request found",
      });
    }

    // Expiry check
    if (record.otpExpiry < new Date()) {
      await OtpVerification.deleteOne({ type, identifier });
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    // Wrong OTP
    if (record.otp !== otp) {
      record.attempts += 1;
      await record.save();

      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // ✅ SUCCESS — Mark as verified
    record.isVerified = true;
    await record.save();

    return res.json({
      message: `${type} verified successfully`,
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export default verifyOtpController;
