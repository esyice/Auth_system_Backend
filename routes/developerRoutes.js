import express from "express";
import jwtMiddleware from "../middlewares/jwt/jwtMiddleware.js";

import getAllUsers from "../controllers/developer/getAllUsersController.js";
import updateUser from "../controllers/developer/updateUserController.js";
import deleteUser from "../controllers/developer/deleteUserController.js";
import registerExternal from "../controllers/external/registerExternalController.js";
import attachProjectContext from "../utils/attachProjectContext.js";

const developerRoutes = express.Router();

/*
|--------------------------------------------------------------------------
| Developer - Project Users Routes
|--------------------------------------------------------------------------
*/

/**
 * GET    /developer/projects/:projectId/users
 * Get all users of a specific project (with pagination/search/sort)
 */
developerRoutes.get("/projects/:projectId/users", jwtMiddleware, getAllUsers);

/**
 * PUT    /developer/projects/:projectId/users/:userId
 * Update a specific user in a project
 */
developerRoutes.put(
  "/projects/:projectId/users/:userId",
  jwtMiddleware,
  updateUser,
);

/**
 * DELETE /developer/projects/:projectId/users/:userId
 * Soft delete a specific user in a project
 */
developerRoutes.delete(
  "/projects/:projectId/users/:userId",
  jwtMiddleware,
  deleteUser,
);

/**
 * POST   /developer/projects/:projectId/users
 * Create a new user inside a project (uses register controller)
 */
developerRoutes.post(
  "/projects/:projectId/users",
  jwtMiddleware,
  attachProjectContext, // 🔥 Attach project context for consistent access in controller
  registerExternal,
);

export default developerRoutes;
