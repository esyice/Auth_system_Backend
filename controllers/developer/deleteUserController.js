import mongoose from "mongoose";
import ApiKey from "../../models/apis/Apikeys.js";
import ExternalUser from "../../models/users/ExternalUser.js";
import { clearProjectUserCache } from "../../utils/cacheInvalidation.js";

const deleteUser = async (req, res) => {
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

    const user = await ExternalUser.findOneAndUpdate(
      { _id: userId, projectId },
      { isActive: false },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ✅ Clear cache AFTER successful update
    await clearProjectUserCache(projectId);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default deleteUser;
