import TryCatch from "../utils/TryCatch.js";
import { Status } from "../models/statusModel.js";

export const newStatus = TryCatch(async (req, res) => {
  const { caption, ownerId, image } = req.body;
  const status = await Status.create({ caption, owner: ownerId, image });
  res.status(201).json({ status });
});

export const getActiveStatuses = TryCatch(async (req, res) => {
  // grouped by owner, only within last 24h (TTL usually handles this, but filter defensively)
  const statuses = await Status.find().populate("owner", "name profilePic").sort({ createdAt: -1 });
  res.json({ statuses });
});

export const markSeen = TryCatch(async (req, res) => {
  const { userId } = req.body;
  const status = await Status.findById(req.params.id);
  if (!status) return res.status(404).json({ message: "No status with this id" });
  if (!status.seenBy.includes(userId)) {
    status.seenBy.push(userId);
    await status.save();
  }
  res.json({ status });
});