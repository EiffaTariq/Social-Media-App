// backend/models/statusModel.js
import mongoose from "mongoose";

const statusSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  image: { type: String },
  caption: { type: String },
  seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now, expires: 86400 }, // TTL: MongoDB auto-deletes after 24h
});

export const Status = mongoose.model("Status", statusSchema);