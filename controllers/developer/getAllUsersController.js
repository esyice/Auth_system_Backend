import mongoose from "mongoose";
import ApiKey from "../../models/apis/Apikeys.js";
import ExternalUser from "../../models/users/ExternalUser.js";
import { redisClient } from "../../config/redis.js";

const getAllUsers = async (req, res) => {
  try {
    const { projectId } = req.params;
    const developerId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        message: "Invalid project ID",
      });
    }

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

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;

    const search = req.query.search?.trim() || "";
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const status = req.query.status;

    const filter = {
      projectId: project._id,
    };

    if (status === "active") filter.isActive = true;
    if (status === "inactive") filter.isActive = false;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // 🔥 Build Redis Cache Key
    const cacheKey = `users:${projectId}:page=${page}:limit=${limit}:search=${search}:sort=${sortBy}:${sortOrder}:status=${status}`;

    // 🔥 Check Cache First
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      // console.log("Serving from Redis cache");
      return res.status(200).json(JSON.parse(cachedData));
    }

    // 🔥 Fetch From DB
    const [users, totalUsers] = await Promise.all([
      ExternalUser.find(filter)
        .select("-password")
        .skip(skip)
        .limit(limit)
        .sort({ [sortBy]: sortOrder }),

      ExternalUser.countDocuments(filter),
    ]);

    const responseData = {
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
    };

    // 🔥 Store In Redis (TTL 60 seconds)
    await redisClient.set(cacheKey, JSON.stringify(responseData), {
      EX: 600,
    });

    // console.log("Serving from MongoDB and caching");

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default getAllUsers;
