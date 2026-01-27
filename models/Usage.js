// models/Usage.js
import mongoose from "mongoose";

const usageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // ===== Counters =====
    today: {
      type: Number,
      default: 0,
    },

    month: {
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

    // ===== Reset helpers =====
    lastDailyReset: {
      type: Date,
      default: Date.now,
    },

    lastMonthlyReset: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Usage", usageSchema);
