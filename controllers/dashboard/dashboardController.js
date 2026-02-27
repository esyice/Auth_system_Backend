// controllers/dashboardController.js
import ApiKey from "../../models/apis/Apikeys.js";
import { redisClient } from "../../config/redis.js";

const formatIST = (date) => {
  if (!date) return null;

  return new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const dashboardController = async (req, res) => {
  try {
    const user = req.user;

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

    const totalTokens = apiKeys.length;

    const lastIssuedToken =
      apiKeys.length > 0 ? { issuedAt: formatIST(apiKeys[0].createdAt) } : null;

    const tokens =
      apiKeys.length > 0
        ? apiKeys.map((key) => ({
            id: key._id.toString(),
            name: key.name,
            active: key.active,
            key: key.rawKey, // 🚨 DEV only
            expiresAt: key.expiresAt ? formatIST(key.expiresAt) : "No Expiry",
            lastIssued: formatIST(key.createdAt),
          }))
        : [];

    /* ================= REAL USAGE ================= */
    const today = new Date().toISOString().slice(0, 10);
    const month = new Date().toISOString().slice(0, 7);

    let todayTotal = 0;
    let monthTotal = 0;
    let totalUsage = 0;

    for (const key of apiKeys) {
      const apiKeyId = key._id.toString();

      const [day, monthCount, total] = await Promise.all([
        redisClient.get(`usage:${apiKeyId}:day:${today}`),
        redisClient.get(`usage:${apiKeyId}:month:${month}`),
        redisClient.get(`usage:${apiKeyId}:total`),
      ]);

      todayTotal += Number(day) || 0;
      monthTotal += Number(monthCount) || 0;
      totalUsage += Number(total) || 0;
    }

    const usage = {
      today: todayTotal,
      month: monthTotal,
      total: totalUsage,
      dailyLimit: 1000, // make dynamic later if needed
      perMinute: 60,
      perHour: 500,
    };

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
