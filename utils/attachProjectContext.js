// middlewares/developer/attachProjectContext.js

import mongoose from "mongoose";
import Project from "../models/apis/Apikeys.js";

const attachProjectContext = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 🔥 Standardized context for controller
    req.projectId = project._id;
    req.projectOwner = project.userId; //  'userId' is the owner field in your Project model

    next();
  } catch (error) {
    console.error("attachProjectContext error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default attachProjectContext;
