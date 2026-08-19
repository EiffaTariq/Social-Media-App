import bcrypt from "bcrypt";
import { User } from "../models/userModel.js";
import TryCatch from "../utils/TryCatch.js";
import generateToken from "../utils/generareToken.js";

export const registerUser = TryCatch(async (req, res) => {
  const { name, email, password, gender } = req.body;

  if (!name || !email || !password || !gender) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    gender,
  });

  generateToken(user._id, res);

  const userSafe = user.toObject();
  delete userSafe.password;

  res.status(201).json({ message: "User registered", user: userSafe });
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
  res.cookie("token", "", { maxAge: 0, httpOnly: true, sameSite: "lax" });
  res.json({ message: "Logged out successfully" });
});

export const getMe = TryCatch(async (req, res) => {
  // req.user is set by isAuth middleware
  res.json({ user: req.user });
});