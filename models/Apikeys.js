import mongoose from "mongoose";

const ApiKeySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    rawKey: {
      type: String,
      required: true, // temporary (you said you'll remove later)
      select: true,
    },

    tokenHash: {
      type: String,
      required: true,
      index: true,
    },

    active: {
      type: Boolean,
      default: true, // 🔥 THIS controls validity
      index: true,
    },

    expiresAt: {
      type: Date,
      default: null, // null = no expiry
      index: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("ApiKeys", ApiKeySchema);
