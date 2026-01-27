import express from "express";
import registerMiddleware from "../middlewares/registerMiddleware.js";
import registerController from "../controllers/registerController.js";
import loginMiddleware from "../middlewares/loginMiddleware.js";
import loginController from "../controllers/loginController.js";
import logoutMiddleware from "../middlewares/logutMiddleware.js";
import logoutController from "../controllers/logoutController.js";

const authRoutes = express.Router();

authRoutes.post("/register", registerMiddleware, registerController);
authRoutes.post("/login", loginMiddleware, loginController);
authRoutes.post("/logout", logoutMiddleware, logoutController);

export default authRoutes;
