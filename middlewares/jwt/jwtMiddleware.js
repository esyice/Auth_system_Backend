import jwt from "jsonwebtoken";
import User from "../../models/users/User.js";
import TokenBlacklist from "../../models/jwt/TokenBlacklist.js";

const verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // 1️⃣ blacklist check
    const blacklisted = await TokenBlacklist.findOne({ token });
    if (blacklisted) {
      return res.status(401).json({ message: "Token revoked" });
    }

    // 2️⃣ verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3️⃣ load user from DB
    const user = await User.findById(decoded.id).select(
      "_id name email role accountStatus",
    );

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 4️⃣ attach to request
    req.user = user;
    req.token = token;

    // 5️⃣ continue
    next();
  } catch (err) {
    console.error("JWT error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default verifyJWT;
