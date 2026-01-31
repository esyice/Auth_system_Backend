import express from "express";
import verifyJWT from "../middlewares/jwt/jwtMiddleware.js";
import createApiController from "../controllers/apis/createApiController.js";
import revokeAllApiKeysController from "../controllers/apis/revokeAllApiKeyController.js";
import revokeSingleKeyController from "../controllers/apis/revokeSingleKeyController.js";
import regenerateSingleKeyController from "../controllers/apis/regenerateSingleKeyController.js";

const apiRoutes = express.Router();

apiRoutes.post("/createApiKey", verifyJWT, createApiController);
apiRoutes.put("/revokeAllKeys", verifyJWT, revokeAllApiKeysController);
apiRoutes.put("/:id/revokeSingleKey", verifyJWT, revokeSingleKeyController);
apiRoutes.put(
  "/:id/regenerateSingleKey",
  verifyJWT,
  regenerateSingleKeyController,
);

export default apiRoutes;
