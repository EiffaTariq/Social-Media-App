import mongoose from "mongoose";
const replySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comment: { type: String },
  },
  { timestamps: true }
);
const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comment: { type: String },
    replies: [replySchema],
  },
  { timestamps: true }
);


const postSchema = new mongoose.Schema({
  caption: { type: String, required: true },
  image: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now },
});







export const Post = mongoose.model("Post", postSchema);