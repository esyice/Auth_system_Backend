import express from "express";

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Sample in-memory data (can later be replaced with DB)
const users = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
];

// Routes

// Root route
app.get("/", (req, res) => {
  res.send("🚀 Hello World! Your API is working fine! with nodemun");
});

// Get all users
app.get("/users", (req, res) => {
  res.json(users);
});

// Get user by ID
app.get("/users/:id", (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// Export the app for server.js
export default app;
