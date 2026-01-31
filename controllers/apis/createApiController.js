import crypto from "crypto";
import Token from "../../models/apis/Apikeys.js";

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

    const now = new Date();
    let finalExpiry = null;

    switch (expiryType) {
      case "1d": {
        finalExpiry = new Date(now);
        finalExpiry.setDate(finalExpiry.getDate() + 1);
        break;
      }

      case "1m": {
        finalExpiry = new Date(now);
        finalExpiry.setMonth(finalExpiry.getMonth() + 1);
        break;
      }

      case "3m": {
        finalExpiry = new Date(now);
        finalExpiry.setMonth(finalExpiry.getMonth() + 3);
        break;
      }

      case "6m": {
        finalExpiry = new Date(now);
        finalExpiry.setMonth(finalExpiry.getMonth() + 6);
        break;
      }

      case "1y": {
        finalExpiry = new Date(now);
        finalExpiry.setFullYear(finalExpiry.getFullYear() + 1);
        break;
      }

      case "custom": {
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
      }

      case "none": {
        finalExpiry = null;
        break;
      }
    }

    /* ================= TOKEN GENERATION ================= */

    const rawKey = `sk_${crypto.randomBytes(32).toString("hex")}`;
    const tokenHash = crypto.createHash("sha256").update(rawKey).digest("hex");

    /* ================= SAVE TO DB ================= */

    const tokenDoc = await Token.create({
      userId: user._id,
      name: name.trim(),
      rawKey, // TEMP – remove later
      tokenHash, // permanent
      active: true,
      expiresAt: finalExpiry,
    });

    /* ================= RESPONSE ================= */

    return res.status(201).json({
      message: "API key created",
      apiKey: rawKey,
      expiresAt: finalExpiry,
      tokenId: tokenDoc._id,
    });
  } catch (err) {
    console.error("Create API key error:", err);
    return res.status(500).json({ message: "Failed to create API key" });
  }
};

export default apiController;
