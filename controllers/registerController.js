// import { User } from "../models/User";

export const registerController = async (req, res) => {

  console.log("Register controller reached" , req.body);
  res.send("registered!");
  // try {
  //   const { name, email, password } = req.body;
  //   const user = new User({ name, email, password });
  //   await user.save();
  //   res.status(201).json({ message: "User registered successfully" });
  // } catch (error) {
  //   res.status(500).json({ message: error.message });
  // }
};