import express from "express";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";

const app = express();


app.use(cors());

// Middleware to parse JSON
app.use(express.json());
app.use('/api/auth', authRoutes);



// Export the app for server.js
export default app;
