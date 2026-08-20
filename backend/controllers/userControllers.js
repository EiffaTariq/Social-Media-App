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

  const { name, gender, bio, profilePic, username } = req.body;

  if (username && username.toLowerCase() !== user.username) {
    if (!/^[a-zA-Z0-9_.]{3,24}$/.test(username)) {
      return res.status(400).json({
        message: "Username must be 3-24 characters and contain only letters, numbers, '.' or '_'",
      });
    }
    const taken = await User.findOne({ username: username.toLowerCase() });
    if (taken) return res.status(400).json({ message: "Username is already taken" });
    user.username = username.toLowerCase();
  }

  if (name) user.name = name;
  if (gender) user.gender = gender;
  if (typeof bio === "string") user.bio = bio;
  if (profilePic) user.profilePic = profilePic;

  await user.save();
  const userSafe = user.toObject();
  delete userSafe.password;
  res.json({ message: "User updated", user: userSafe });
});

export const deleteUser = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "No user with this id" });
  await user.deleteOne();
  res.json({ message: "User deleted" });
});

// GET /api/user/search?q=someUsername
export const searchUsers = TryCatch(async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.json({ users: [] });

  const regex = new RegExp(q, "i");
  const users = await User.find({
    $or: [{ username: regex }, { name: regex }],
  })
    .select("-password")
    .limit(15);

  res.json({ users });
});

// POST /api/user/:id/follow  (requires isAuth, toggles follow/unfollow)
export const toggleFollow = TryCatch(async (req, res) => {
  const targetId = req.params.id;
  const currentUserId = req.user._id.toString();

  if (targetId === currentUserId) {
    return res.status(400).json({ message: "You can't follow yourself" });
  }

  const targetUser = await User.findById(targetId);
  if (!targetUser) return res.status(404).json({ message: "No user with this id" });

  const currentUser = await User.findById(currentUserId);

  const alreadyFollowing = currentUser.followings.some(
    (id) => id.toString() === targetId
  );

  if (alreadyFollowing) {
    currentUser.followings = currentUser.followings.filter(
      (id) => id.toString() !== targetId
    );
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== currentUserId
    );
    await currentUser.save();
    await targetUser.save();
    return res.json({ message: "Unfollowed", following: false });
  }

  currentUser.followings.push(targetId);
  targetUser.followers.push(currentUserId);
  await currentUser.save();
  await targetUser.save();
  res.json({ message: "Followed", following: true });
});