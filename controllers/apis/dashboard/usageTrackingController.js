import { getUsageByApiKey } from "../../../services/usage/usageService.js";
import ApiKey from "../../../models/apis/Apikeys.js";

const usageTrackingController = async (req, res) => {
  try {
    const { apiKeyId } = req.params;
    const userId = req.user._id; // from JWT

    // Make sure API key belongs to logged-in user
    const apiKey = await ApiKey.findOne({
      _id: apiKeyId,
      userId,
    });

    if (!apiKey) {
      return res.status(404).json({ message: "API key not found" });
    }

    const usage = await getUsageByApiKey(apiKeyId);

    res.json({
      ...usage,
      dailyLimit: 1000,
      perMinute: 60,
      perHour: 500,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch usage" });
  }
};

export default usageTrackingController;
