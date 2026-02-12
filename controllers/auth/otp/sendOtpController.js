import OtpVerification from "../../../models/verification/OtpVerification.js";

const sendOtpController = async (req, res) => {
  try {
    const { type, identifier } = req.body;

    if (!type || !identifier) {
      return res.status(400).json({
        message: "Type and identifier required",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OtpVerification.findOneAndUpdate(
      { type, identifier },
      {
        type,
        identifier,
        otp,
        otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
        attempts: 0,
      },
      { upsert: true, new: true }
    );

    console.log(`${type} OTP for testing:`, otp);

    return res.json({
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error("Send OTP error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export default sendOtpController;