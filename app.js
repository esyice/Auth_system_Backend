import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import global from "./routes/globalRoutes.js"

const app = express();

connectDB();


// Enable CORS
app.use(cors());
// Middleware to parse JSON
app.use(express.json());
app.use('/api', global);



// Export the app for server.js
export default app;
