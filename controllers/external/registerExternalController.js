import bcrypt from "bcrypt";
import ExternalUser from "../../models/users/ExternalUser.js";

const registerExternal = async (req, res) => {

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await ExternalUser.findOne({
      email,
      projectId: req.projectId,
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await ExternalUser.create({
      name,
      email,
      password: hashedPassword,
      projectId: req.projectId,
      ownerId: req.projectOwner,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default registerExternal;
