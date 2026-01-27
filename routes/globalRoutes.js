import express from "express";
import authRoutes from "./authRoutes.js";
import verifyJWT from "../middlewares/jwtMiddleware.js";
import dashboardController from "../controllers/dashboardController.js";
import apiController from "../controllers/apiController.js";

const globalRoutes = express.Router();
// console.log("GLOBAL ROUTES FILE LOADED");
/* ✅ WRITE IT HERE — RIGHT AFTER Router() */
globalRoutes.use((req, res, next) => {
  // console.log("➡️ GLOBAL ROUTER:", req.method, req.originalUrl);
  next();
});
globalRoutes.use("/auth", authRoutes);
globalRoutes.get("/dashboard", verifyJWT, dashboardController);
globalRoutes.post("/apikeys", verifyJWT, apiController);

export default globalRoutes;
