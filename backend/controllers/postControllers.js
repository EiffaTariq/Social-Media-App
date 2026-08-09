import { Post } from "../models/postModel.js";
import TryCatch from "../utils/TryCatch.js";

export const newPost = TryCatch(async (req, res) => {
  const { caption } = req.body;

  if (!caption) {
    return res.status(400).json({ message: "Caption is required" });
  }

  const post = await Post.create({ caption });

  res.status(201).json({ message: "Post created", post });
});

export const getAllPosts = TryCatch(async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json({ posts });
});

export const editCaption = TryCatch(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "No post with this id" });
  }

  post.caption = req.body.caption;
  await post.save();

  res.json({ message: "Post updated", post });
});

export const deletePost = TryCatch(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "No post with this id" });
  }

  await post.deleteOne();

  res.json({ message: "Post deleted" });
});