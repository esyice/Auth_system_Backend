import jwt from "jsonwebtoken";
import LogoutActivity from "../models/LogoutActivity.js";
import TokenBlacklist from "../models/TokenBlacklist.js";

const logoutController = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];

      try {
        // Decode token to get expiry + userId
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 1️⃣ Blacklist token (until it naturally expires)
        await TokenBlacklist.create({
          token,
          userId: decoded.id, // optional but useful
          expiresAt: new Date(decoded.exp * 1000),
        });
        console.log("token blacklisted ");

        // 2️⃣ Log logout activity (best-effort)
        if (req.logoutInfo) {
          await LogoutActivity.create({
            userId: decoded.id,
            status: "LOGOUT",
            ip: req.logoutInfo.ip,
            userAgent: req.logoutInfo.userAgent,
          });
        }
      } catch (err) {
        // Token expired / invalid → do NOT block logout
        console.warn("Logout token decode failed:", err.message);
      }
    }

    // 3️⃣ Always succeed
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error("Logout error:", err);

    // Logout must NEVER fail from frontend POV
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  }
};

export default logoutController;
