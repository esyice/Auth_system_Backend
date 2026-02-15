import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ExternalUser from "../../models/users/ExternalUser.js";

const loginExternal = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await ExternalUser.findOne({
      email,
      projectId: req.projectId,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, projectId: req.projectId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default loginExternal;
