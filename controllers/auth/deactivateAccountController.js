// controllers/accountController.js
import User from "../../models/users/User.js";

const deactivateAccountController = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingUser = await User.findById(user._id);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (existingUser.accountStatus === "deactivated") {
      return res.status(400).json({ message: "Account already deactivated" });
    }

    existingUser.accountStatus = false; // set to deactivated
    await existingUser.save();

    return res.status(200).json({
      message: "Account deactivated successfully",
    });
  } catch (err) {
    console.error("Deactivate account error:", err);
    return res.status(500).json({ message: "Failed to deactivate account" });
  }
};

export default deactivateAccountController;
