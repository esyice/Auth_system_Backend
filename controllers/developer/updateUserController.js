import mongoose from "mongoose";
import ApiKey from "../../models/apis/Apikeys.js";
import ExternalUser from "../../models/users/ExternalUser.js";

const updateUser = async (req, res) => {
  try {
    const { projectId, userId } = req.params;
    const developerId = req.user._id;

    if (
      !mongoose.Types.ObjectId.isValid(projectId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({
        message: "Invalid ID format",
      });
    }

    const project = await ApiKey.findOne({
      _id: projectId,
      userId: developerId,
      active: true,
    });

    if (!project) {
      return res.status(403).json({
        message: "Access denied. Project not found or unauthorized.",
      });
    }

    const { name, email, isActive } = req.body;

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (isActive !== undefined) updateData.isActive = isActive;

    // 🔥 Email uniqueness check
    if (email !== undefined) {
      const existingUser = await ExternalUser.findOne({
        email,
        projectId,
        _id: { $ne: userId }, // exclude current user
      });

      if (existingUser) {
        return res.status(409).json({
          message: "Email already exists in this project",
        });
      }

      updateData.email = email;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No valid fields provided for update",
      });
    }

    const updatedUser = await ExternalUser.findOneAndUpdate(
      { _id: userId, projectId },
      updateData,
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);

    // Handle duplicate key error (in case index catches it)
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Email already exists in this project",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default updateUser;
