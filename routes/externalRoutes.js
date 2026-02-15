import express from "express";
import verifyApiKey from "../middlewares/api/verifyApiKey.js";
import registerExternal from "../controllers/external/registerExternalController.js";
import loginExternal from "../controllers/external/loginExternalController.js";

const externalRoutes = express.Router();

// External User Registration
externalRoutes.post("/register", verifyApiKey, registerExternal);

// External User Login
externalRoutes.post("/login", verifyApiKey, loginExternal);

export default externalRoutes;
