import TryCatch from "../utils/TryCatch.js";
import { User } from "../models/userModel.js";

export const createUser = TryCatch(async (req, res) => {
  const { name, email, password, gender } = req.body;
  if (!name || !email || !password || !gender) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const user = await User.create({ name, email, password, gender });
  res.status(201).json({ message: "User created", user });
});

export const getAllUser = TryCatch(async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ users });
});

export const getUser = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "No user with this id" });
  res.json(user);
});

export const updateUser = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "No user with this id" });

  const { name, gender } = req.body;
  if (name) user.name = name;
  if (gender) user.gender = gender;

  await user.save();
  res.json({ message: "User updated", user });
});

export const deleteUser = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "No user with this id" });
  await user.deleteOne();
  res.json({ message: "User deleted" });
});