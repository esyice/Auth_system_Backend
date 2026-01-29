import express from "express";
import verifyJWT from "../middlewares/jwtMiddleware.js";
import createApiController from "../controllers/createApiController.js";
import revokeAllApiKeysController from "../controllers/revokeAllApiKeyController.js";

const apiRoutes = express.Router();

apiRoutes.post("/createApiKey", verifyJWT, createApiController);
apiRoutes.put("/revokeAllKeys", verifyJWT, revokeAllApiKeysController);

export default apiRoutes;
