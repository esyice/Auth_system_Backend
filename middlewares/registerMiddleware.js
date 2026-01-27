// middleware/registerMiddleware.js
import express from "express";

const registerMiddleware = (req, res, next) => {
  console.log("🧩 Register middleware triggered");

  const { name, email, password } = req.body;

  // Example: simple validation before hitting controller
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  console.log("✅ Register middleware passed");
  next(); // pass control to the controller
};

export default registerMiddleware;
