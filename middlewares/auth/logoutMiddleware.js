import jwt from "jsonwebtoken";

const logoutMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.logoutInfo = {
        userId: decoded.id,
        exp: decoded.exp,
      };
    } catch (err) {
      // Invalid or expired token → ignore
      console.warn("Logout token verification failed:", err.message);
    }

    next();
  } catch (err) {
    next();
  }
};

export default logoutMiddleware;
