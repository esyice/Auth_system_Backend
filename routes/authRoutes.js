import express from "express";
import registerMiddleware from "../middlewares/auth/registerMiddleware.js";
import registerController from "../controllers/auth/registerController.js";
import loginMiddleware from "../middlewares/auth/loginMiddleware.js";
import loginController from "../controllers/auth/loginController.js";
import logoutMiddleware from "../middlewares/auth/logoutMiddleware.js";
import logoutController from "../controllers/auth/logoutController.js";
import verify from "../middlewares/jwt/jwtMiddleware.js";
import deactivateAccountController from "../controllers/auth/deactivateAccountController.js";
import sendOtpController from "../controllers/auth/otp/sendOtpController.js";
import verifyOtpController from "../controllers/auth/otp/verifyOtpController.js";
import resetPassword from "../controllers/auth/resetPasswordController.js";
import otpFlowMiddleware from "../middlewares/otpflow/otpFlowMiddleware.js";

const authRoutes = express.Router();

authRoutes.post("/register", registerMiddleware, registerController);
authRoutes.post("/login", loginMiddleware, loginController);
authRoutes.post("/logout", logoutMiddleware, logoutController);
authRoutes.put("/account/deactivate", verify, deactivateAccountController);
authRoutes.post("/reset-password", resetPassword);
authRoutes.post(
  "/register/send-otp",
  otpFlowMiddleware("register"),
  sendOtpController,
);
authRoutes.post(
  "/register/verify-otp",
  otpFlowMiddleware("register"),
  verifyOtpController,
);
authRoutes.post(
  "/reset/send-otp",
  otpFlowMiddleware("reset"),
  sendOtpController,
);
authRoutes.post(
  "/reset/verify-otp",
  otpFlowMiddleware("reset"),
  verifyOtpController,
);

export default authRoutes;
