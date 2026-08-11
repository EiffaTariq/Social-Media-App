import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  caption: { type: String, required: true },
  image: { type: String }, 
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      comment: { type: String },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export const Post = mongoose.model("Post", postSchema);