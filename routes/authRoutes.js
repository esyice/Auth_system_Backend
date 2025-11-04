import express from 'express';
import registerMiddleware from '../middlewares/registerMiddleware.js';
import { registerController } from '../controllers/registerController.js';

const authRoutes = express.Router();

authRoutes.post("/register", registerMiddleware, registerController );
authRoutes.get("/login", (req, res) => {
  res.send("login!");
});

export default authRoutes;