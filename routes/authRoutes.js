import express from "express";
import registerMiddleware from "../middlewares/auth/registerMiddleware.js";
import registerController from "../controllers/auth/registerController.js";
import loginMiddleware from "../middlewares/auth/loginMiddleware.js";
import loginController from "../controllers/auth/loginController.js";
import logoutMiddleware from "../middlewares/auth/logoutMiddleware.js";
import logoutController from "../controllers/auth/logoutController.js";
import verify from "../middlewares/jwt/jwtMiddleware.js";
import deactivateAccountController from "../controllers/auth/deactivateAccountController.js";

const authRoutes = express.Router();

authRoutes.post("/register", registerMiddleware, registerController);
authRoutes.post("/login", loginMiddleware, loginController);
authRoutes.post("/logout", logoutMiddleware, logoutController);
authRoutes.put("/account/deactivate", verify, deactivateAccountController);

export default authRoutes;
