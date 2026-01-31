// controllers/apiKeyController.js
import e from "express";
import ApiKey from "../../models/apis/Apikeys.js";

const revokeSingleKeyController = async (req, res) => {
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

    key.active = false;
    await key.save();

    return res.status(200).json({
      message: "API key revoked",
      tokenId: key._id,
    });
  } catch (err) {
    console.error("Revoke key error:", err);
    return res.status(500).json({ message: "Failed to revoke key" });
  }
};

export default revokeSingleKeyController;
