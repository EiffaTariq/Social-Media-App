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

export const toggleFollow = TryCatch(async (req, res) => {
  const targetId = req.params.id;
  const currentUserId = req.user._id.toString();

  if (targetId === currentUserId) {
    return res.status(400).json({ message: "You can't follow yourself" });
  }

  const targetUser = await User.findById(targetId);
  if (!targetUser) return res.status(404).json({ message: "No user with this id" });
  const currentUser = await User.findById(currentUserId);

  const alreadyFollowing = currentUser.followings.some((id) => id.toString() === targetId);
  if (alreadyFollowing) {
    currentUser.followings = currentUser.followings.filter((id) => id.toString() !== targetId);
    targetUser.followers = targetUser.followers.filter((id) => id.toString() !== currentUserId);
    await currentUser.save();
    await targetUser.save();
    return res.json({ message: "Unfollowed", following: false, requested: false });
  }

  const alreadyRequested = targetUser.followRequests.some((id) => id.toString() === currentUserId);
  if (alreadyRequested) {
    targetUser.followRequests = targetUser.followRequests.filter((id) => id.toString() !== currentUserId);
    targetUser.notifications = targetUser.notifications.filter(
      (n) => !(n.type === "follow_request" && n.from.toString() === currentUserId)
    );
    await targetUser.save();
    return res.json({ message: "Follow request cancelled", following: false, requested: false });
  }

  targetUser.followRequests.push(currentUserId);
  targetUser.notifications.unshift({
    type: "follow_request",
    from: currentUserId,
    message: `${currentUser.name} wants to follow you`,
  });
  await targetUser.save();
  res.json({ message: "Follow request sent", following: false, requested: true });
});

export const acceptFollowRequest = TryCatch(async (req, res) => {
  const requesterId = req.params.id;
  const currentUser = await User.findById(req.user._id);
  const requester = await User.findById(requesterId);
  if (!requester) return res.status(404).json({ message: "No user with this id" });

  const hasRequest = currentUser.followRequests.some((id) => id.toString() === requesterId);
  if (!hasRequest) return res.status(400).json({ message: "No pending request from this user" });

  currentUser.followRequests = currentUser.followRequests.filter((id) => id.toString() !== requesterId);
  currentUser.followers.push(requesterId);
  requester.followings.push(currentUser._id);

  currentUser.notifications = currentUser.notifications.filter(
    (n) => !(n.type === "follow_request" && n.from.toString() === requesterId)
  );
  requester.notifications.unshift({
    type: "follow_accept",
    from: currentUser._id,
    message: `${currentUser.name} accepted your follow request`,
  });

  await currentUser.save();
  await requester.save();
  res.json({ message: "Follow request accepted" });
});

export const rejectFollowRequest = TryCatch(async (req, res) => {
  const requesterId = req.params.id;
  const currentUser = await User.findById(req.user._id);

  currentUser.followRequests = currentUser.followRequests.filter((id) => id.toString() !== requesterId);
  currentUser.notifications = currentUser.notifications.filter(
    (n) => !(n.type === "follow_request" && n.from.toString() === requesterId)
  );
  await currentUser.save();
  res.json({ message: "Follow request rejected" });
});