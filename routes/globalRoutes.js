import express from "express";
import authRoutes from "./authRoutes.js";
import apiRoutes from "./apiRoutes.js";
import verifyJWT from "../middlewares/jwt/jwtMiddleware.js";
import dashboardController from "../controllers/dashboard/dashboardController.js";
import externalRoutes from "./externalRoutes.js";
import developerRoutes from "./developerRoutes.js";
import { sendEmail } from "../services/email/emailService.js";

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

//test route
globalRoutes.get("/testemail", async (req, res) => {
  try {
    await sendEmail({
      to: "ansh@ezice.in",
      subject: "Test Email",
      html: "<h1>Email is working</h1>",
    });

    res.send("Email sent");
  } catch (error) {
    res.status(500).send("Email failed", error);
  }
});

export default globalRoutes;
