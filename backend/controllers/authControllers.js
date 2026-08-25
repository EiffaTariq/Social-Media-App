import bcrypt from "bcrypt";
import { User } from "../models/userModel.js";
import TryCatch from "../utils/TryCatch.js";
import generateToken from "../utils/generareToken.js";

export const registerUser = TryCatch(async (req, res) => {
  const { name, username, email, password, gender, bio, profilePic } = req.body;

  if (!name || !username || !email || !password || !gender) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!/^[a-zA-Z0-9_.]{3,24}$/.test(username)) {
    return res.status(400).json({
      message: "Username must be 3-24 characters and contain only letters, numbers, '.' or '_'",
    });
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return res.status(400).json({ message: "User already exists" });
  }

  const existingUsername = await User.findOne({ username: username.toLowerCase() });
  if (existingUsername) {
    return res.status(400).json({ message: "Username is already taken" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    username: username.toLowerCase(),
    email,
    password: hashedPassword,
    gender,
    bio,
    profilePic,
  });

  const userSafe = user.toObject();
  delete userSafe.password;

  res.status(201).json({ message: "User registered. Please log in.", user: userSafe });
});

export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  generateToken(user._id, res);

  const userSafe = user.toObject();
  delete userSafe.password;

  res.status(200).json({ message: "Login successful", user: userSafe });
});

export const logoutUser = TryCatch((req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
  res.cookie("token", "", { httpOnly: true, sameSite: "lax", expires: new Date(0) });
  res.json({ message: "Logged out successfully" });
});

export const getMe = TryCatch(async (req, res) => {
  res.json({ user: req.user });
});