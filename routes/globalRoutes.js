import express from "express";
import authRoutes from "./authRoutes.js";
import apiRoutes from "./apiRoutes.js";
import verifyJWT from "../middlewares/jwt/jwtMiddleware.js";
import dashboardController from "../controllers/dashboard/dashboardController.js";
import externalRoutes from "./externalRoutes.js";
import developerRoutes from "./developerRoutes.js";

const globalRoutes = express.Router();
// console.log("GLOBAL ROUTES FILE LOADED");
/* ✅ WRITE IT HERE — RIGHT AFTER Router() */
globalRoutes.use((req, res, next) => {
  // console.log("➡️ GLOBAL ROUTER:", req.method, req.originalUrl);
  next();
});
globalRoutes.use("/auth", authRoutes);
globalRoutes.get("/dashboard", verifyJWT, dashboardController);
globalRoutes.use("/apikeys", apiRoutes);
globalRoutes.use("/v1", externalRoutes);
globalRoutes.use("/developer", developerRoutes);

export default globalRoutes;
