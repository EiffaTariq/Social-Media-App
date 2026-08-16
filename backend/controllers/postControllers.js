import { Post } from "../models/postModel.js";
import TryCatch from "../utils/TryCatch.js";

export const newPost = TryCatch(async (req, res) => {
   console.log("POST /api/post/new hit");
  console.log("Request body:", req.body);
  const { caption, ownerId, image } = req.body;
  if (!caption || !ownerId) {
    return res.status(400).json({ message: "Caption and ownerId are required" });
  }
  const post = await Post.create({ caption, owner: ownerId, image });

  console.log("Created post:", post);
  console.log("Created post ID:", post._id);


  res.status(201).json({ message: "Post created", post });
});

export const getAllPosts = TryCatch(async (req, res) => {
  const posts = await Post.find()
  .populate("owner", "name email")
  .populate("comments.user", "name")
  .sort({ createdAt: -1 });
  res.json({ posts });
});

export const editCaption = TryCatch(async (req, res) => {
  const { caption } = req.body;
  if (!caption || typeof caption !== "string") {
    return res.status(400).json({ message: "Caption is required" });
  }
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "No post with this id" });
  post.caption = caption;
  await post.save();
  res.json({ message: "Post updated", post });
});

export const deletePost = TryCatch(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "No post with this id" });
  await post.deleteOne();
  res.json({ message: "Post deleted" });
});

export const likeUnlikePost = TryCatch(async (req, res) => {
  const { userId } = req.body;
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "No post with this id" });

  if (post.likes.includes(userId)) {
    post.likes = post.likes.filter((id) => id.toString() !== userId);
    await post.save();
    return res.json({ message: "Post unliked", post });
  }
  post.likes.push(userId);
  await post.save();
  res.json({ message: "Post liked", post });
});

export const addComment = TryCatch(async (req, res) => {
  const { userId, comment } = req.body;
  if (!userId || !comment) return res.status(400).json({ message: "userId and comment are required" });

  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "No post with this id" });

  post.comments.push({ user: userId, comment });
  await post.save();
  await post.populate("comments.user comments.replies.user", "name");
  res.json({ message: "Comment added", post });
});

export const editComment = TryCatch(async (req, res) => {
  const { comment } = req.body;
  if (!comment || typeof comment !== "string") {
    return res.status(400).json({ message: "Comment text is required" });
  }
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "No post with this id" });

  const target = post.comments.id(req.params.commentId);
  if (!target) return res.status(404).json({ message: "No comment with this id" });

  target.comment = comment;
  await post.save();
  await post.populate("comments.user comments.replies.user", "name");
  res.json({ message: "Comment updated", post });
});

export const deleteComment = TryCatch(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "No post with this id" });

  const target = post.comments.id(req.params.commentId);
  if (!target) return res.status(404).json({ message: "No comment with this id" });

  target.deleteOne();
  await post.save();
  await post.populate("comments.user comments.replies.user", "name");
  res.json({ message: "Comment deleted", post });
});

export const replyToComment = TryCatch(async (req, res) => {
  const { userId, comment } = req.body;
  if (!userId || !comment) return res.status(400).json({ message: "userId and comment are required" });

  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "No post with this id" });

  const target = post.comments.id(req.params.commentId);
  if (!target) return res.status(404).json({ message: "No comment with this id" });

  target.replies.push({ user: userId, comment });
  await post.save();
  await post.populate("comments.user comments.replies.user", "name");
  res.json({ message: "Reply added", post });
});