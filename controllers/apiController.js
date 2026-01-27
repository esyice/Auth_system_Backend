import crypto from "crypto";
import Token from "../models/Apikeys.js";

/**
 * POST /apikeys
 * Body:
 * {
 *   name: string,
 *   expiryType: "1d" | "1m" | "3m" | "6m" | "1y" | "none" | "custom",
 *   expiresAt?: "YYYY-MM-DD"
 * }
 */
const apiController = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, expiryType, expiresAt } = req.body;

    /* ================= VALIDATION ================= */

    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "Key name is required" });
    }

    const allowedExpiryTypes = ["1d", "1m", "3m", "6m", "1y", "none", "custom"];

    if (!allowedExpiryTypes.includes(expiryType)) {
      return res.status(400).json({ message: "Invalid expiry type" });
    }

    /* ================= EXPIRY CALCULATION ================= */

    let finalExpiry = null;
    const now = new Date();

    switch (expiryType) {
      case "1d":
        finalExpiry = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        break;
      case "1m":
        finalExpiry = new Date(new Date().setMonth(new Date().getMonth() + 1));
        break;
      case "3m":
        finalExpiry = new Date(new Date().setMonth(new Date().getMonth() + 3));
        break;
      case "6m":
        finalExpiry = new Date(new Date().setMonth(new Date().getMonth() + 6));
        break;
      case "1y":
        finalExpiry = new Date(
          new Date().setFullYear(new Date().getFullYear() + 1),
        );
        break;
      case "custom":
        if (!expiresAt) {
          return res
            .status(400)
            .json({ message: "Custom expiry date required" });
        }
        finalExpiry = new Date(expiresAt);
        if (isNaN(finalExpiry.getTime())) {
          return res.status(400).json({ message: "Invalid expiry date" });
        }
        break;
      case "none":
        finalExpiry = null;
        break;
    }

    /* ================= TOKEN GENERATION ================= */

    // Raw API key (DEV MODE: stored + returned)
    const rawKey = `sk_${crypto.randomBytes(32).toString("hex")}`;

    // Hashed key (future-safe)
    const tokenHash = crypto.createHash("sha256").update(rawKey).digest("hex");

    /* ================= SAVE TO DB ================= */

    const tokenDoc = await Token.create({
      userId: user._id,
      name: name.trim(),

      // ⚠️ TEMP: storing both
      rawKey, // ❗ remove later
      tokenHash, // ✅ keep forever

      active: true,
      expiresAt: finalExpiry,
    });

    /* ================= RESPONSE ================= */

    return res.status(201).json({
      message: "API key created",
      apiKey: rawKey, // shown to user
      expiresAt: finalExpiry,
      tokenId: tokenDoc._id, // useful for frontend actions
    });
  } catch (err) {
    console.error("Create API key error:", err);
    return res.status(500).json({
      message: "Failed to create API key",
    });
  }
};

export default apiController;
