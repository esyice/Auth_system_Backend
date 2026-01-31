// controllers/apiKeyController.js
import crypto from "crypto";
import ApiKey from "../../models/apis/Apikeys.js";

const regenerateSingleKeyController = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const key = await ApiKey.findOne({
      _id: id,
      userId: user._id,
      active: true,
    });

    if (!key) {
      return res.status(404).json({ message: "API key not found" });
    }

    // 🔑 generate new key
    const rawKey = `sk_${crypto.randomBytes(32).toString("hex")}`;
    const tokenHash = crypto.createHash("sha256").update(rawKey).digest("hex");

    key.rawKey = rawKey; // ⚠️ DEV only
    key.tokenHash = tokenHash;
    key.updatedAt = new Date();

    await key.save();


    return res.status(200).json({
      message: "API key regenerated",
      apiKey: rawKey, // 👈 return ONCE
      tokenId: key._id,
    });
  } catch (err) {
    console.error("Regenerate key error:", err);
    return res.status(500).json({ message: "Failed to regenerate API key" });
  }
};

export default regenerateSingleKeyController;
