import mongoose from "mongoose";

const otpVerificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["email", "mobile"],
      required: true,
    },
    identifier: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    otpExpiry: {
      type: Date,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

otpVerificationSchema.index({ type: 1, identifier: 1 }, { unique: true });

export default mongoose.model("OtpVerification", otpVerificationSchema);
