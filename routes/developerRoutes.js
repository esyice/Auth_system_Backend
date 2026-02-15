import express from "express";
import jwtMiddleware from "../middlewares/jwt/jwtMiddleware.js";
import getAllUsers from "../controllers/developer/getAllUsersController.js";

const developerRoutes = express.Router();

// Get all users of a project
developerRoutes.get("/projects/:projectId/users", jwtMiddleware, getAllUsers);

export default developerRoutes;
