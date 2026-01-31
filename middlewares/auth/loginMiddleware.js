import express from "express";

const loginMiddleware = (req, res, next) => {
  // console.log("🧩 Login middleware triggered")
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" })
  };
    // console.log("✅ Login middleware passed")
    next(); // pass control to the controller

};

export default loginMiddleware;
