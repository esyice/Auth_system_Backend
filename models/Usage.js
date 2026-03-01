// models/Usage.js
import mongoose from "mongoose";

const usageSchema = new mongoose.Schema(
  {
    apiKeyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Apikeys",
      required: true,
      unique: true,
      index: true,
    },

    // ===== Persistent Counters (Mongo) =====
    month: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      default: 0,
    },

    // ===== Limits =====
    limitPerDay: {
      type: Number,
      default: 1000,
    },

    limitPerMonth: {
      type: Number,
      default: 10000,
    },

    // ===== Reset Helper =====
    lastMonthlyReset: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Usage", usageSchema);
