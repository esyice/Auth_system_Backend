import mongoose from "mongoose";
import ApiKey from "../../models/apis/Apikeys.js";
import ExternalUser from "../../models/users/ExternalUser.js";

const getAllUsers = async (req, res) => {
  try {
    const { projectId } = req.params;
    const developerId = req.user._id;

    // ✅ Validate projectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

    // 🔐 Verify project ownership
    const project = await ApiKey.findOne({
      _id: projectId,
      userId: developerId,
      active: true,
    }).select("name createdAt");

    if (!project) {
      return res.status(403).json({
        message: "Access denied. Project not found or unauthorized.",
      });
    }

    // 🔥 Pagination
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;

    // 🔥 Search
    const search = req.query.search?.trim() || "";

    // 🔥 Sorting
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    // 🔥 Status filter
    const status = req.query.status;

    // 🔥 Build filter object
    const filter = {
      projectId: project._id,
    };

    if (status === "active") {
      filter.isActive = true;
    }

    if (status === "inactive") {
      filter.isActive = false;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // 🔥 Execute queries in parallel
    const [users, totalUsers] = await Promise.all([
      ExternalUser.find(filter)
        .select("-password")
        .skip(skip)
        .limit(limit)
        .sort({ [sortBy]: sortOrder }),

      ExternalUser.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      project: {
        id: project._id,
        name: project.name,
        createdAt: project.createdAt,
      },
      meta: {
        total: totalUsers,
        page,
        limit,
        totalPages: Math.ceil(totalUsers / limit),
      },
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default getAllUsers;
