import jwt from "jsonwebtoken";

const logoutMiddleware = (req, res, next) => {
  try {
    // console.log("LOGOUT MIDDLEWARE HIT");

    const authHeader = req.headers.authorization;

    // If no token → allow logout silently
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];

    // Verify token (DO NOT throw logout error)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach logout info
    req.logoutInfo = {
      userId: decoded.id,
      timestamp: new Date(),
      ip: req.ip,
      userAgent: req.headers["user-agent"] || "unknown",
    };

    next();
  } catch (err) {
    // Token expired / invalid → still allow logout
    console.warn("Logout token verification failed:", err.message);
    next();
  }
};

export default logoutMiddleware;
