import ApiKey from "../models/Apikeys.js";

/**
 * POST /apikeys/revoke-all
 * Requires authentication (verifyJWT middleware)
 */
const revokeAllKeysController = async (req, res) => {
  try {
    // set by verifyJWT middleware
    const user = req.user;

    /* ================= AUTH CHECK ================= */
    if (!user || !user._id) {
      return res.status(401).json({
        message: "Unauthorized eeeee",
      });
    }

    /* ================= REVOKE ALL ACTIVE KEYS ================= */
    const result = await ApiKey.updateMany(
      {
        userId: user._id,
        active: true,
      },
      {
        $set: { active: false },
      },
    );

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      message: "All API keys revoked successfully",
      revokedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("Revoke all API keys error:", err);

    return res.status(500).json({
      message: "Failed to revoke API keys",
    });
  }
};

export default revokeAllKeysController;
