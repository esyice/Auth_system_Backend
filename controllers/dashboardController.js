// controllers/dashboardController.js
import ApiKey from "../models/Apikeys.js";

const dashboardController = async (req, res) => {
  try {
    const user = req.user; // set by verifyJWT middleware

    /* ================= SAFETY ================= */
    if (!user) {
      return res.status(401).json(null);
    }

    if (user.accountStatus === "deactivated") {
      return res.status(403).json({
        message: "Account is deactivated",
      });
    }

    /* ================= FETCH TOKENS ================= */
    const apiKeys = await ApiKey.find({ userId: user._id, active: true })
      .select("name active expiresAt createdAt rawKey")
      .sort({ createdAt: -1 })
      .lean();

    // total number of tokens
    const totalTokens = apiKeys.length;

    // last issued token (most recent)
    const lastIssuedToken =
      apiKeys.length > 0
        ? {
            issuedAt: apiKeys[0].createdAt
              ? apiKeys[0].createdAt.toISOString().split("T")[0]
              : null,
          }
        : null;

    // map to desired format
    const tokens =
      apiKeys.length > 0
        ? apiKeys.map((key) => ({
            id: key._id.toString(),
            name: key.name,
            active: key.active,
            key: key.rawKey, // 🚨 exposed
            expiresAt: key.expiresAt
              ? key.expiresAt.toISOString().split("T")[0]
              : "No Expiry",
            lastIssued: key.createdAt
              ? key.createdAt.toISOString().split("T")[0]
              : null,
          }))
        : null;

    /* ================= USAGE (mock for now) ================= */
    const usage = {
      today: 124,
      limit: 1000,
    };

    console.log("networks calls dashboard controller");

    /* ================= FINAL RESPONSE ================= */
    return res.status(200).json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        status: user.accountStatus,
      },
      meta: {
        totalTokens,
        lastIssuedToken,
      },

      tokens,
      usage,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return res.status(500).json(null);
  }
};

export default dashboardController;
