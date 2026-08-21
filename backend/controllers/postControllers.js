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

const VISIBILITY_VALUES = ["public", "friends", "private"];

export const editPost = TryCatch(async (req, res) => {
  const { caption, visibility, location, eventDate, altText, image } = req.body;
  const errors = {};

  // caption
  if (!caption || typeof caption !== "string" || !caption.trim()) {
    errors.caption = "Caption is required";
  } else if (caption.trim().length < 3) {
    errors.caption = "Caption must be at least 3 characters";
  } else if (caption.trim().length > 500) {
    errors.caption = "Caption cannot exceed 500 characters";
  }
  // visibility (dropdown)
  if (!visibility || !VISIBILITY_VALUES.includes(visibility)) {
    errors.visibility = "Select a valid visibility option";
  }
  // eventDate (date, optional but can't be in the future)
  if (eventDate) {
    const parsed = new Date(eventDate);
    if (isNaN(parsed.getTime())) {
      errors.eventDate = "Enter a valid date";
    } else if (parsed > new Date()) {
      errors.eventDate = "Date cannot be in the future";
    }
  }
  if (image) {
    const isValidImage = /^data:image\/(jpeg|jpg|png|webp);base64,/.test(image);
    if (!isValidImage) {
      errors.image = "Image must be a JPEG, PNG, or WEBP file";
    } else {
      // rough size check: base64 length * 0.75 ≈ decoded bytes
      const approxBytes = image.length * 0.75;
      if (approxBytes > 5 * 1024 * 1024) {
        errors.image = "Image must be smaller than 5MB";
      }
    }
  }

  // altText required only if an image is present on the post after this edit
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "No post with this id" });

  const willHaveImage = image || post.image;
  if (willHaveImage && altText && altText.length > 150) {
    errors.altText = "Alt text cannot exceed 150 characters";
  }
  if (willHaveImage && !altText && !post.altText) {
    errors.altText = "Alt text is required when an image is attached";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: "Validation failed", errors });
  }

  post.caption = caption.trim();
  post.visibility = visibility;
  post.location = location?.trim() || "";
  post.eventDate = eventDate || post.eventDate;
  post.altText = altText?.trim() || post.altText || "";
  if (image) post.image = image;

  await post.save();
  res.json({ message: "Post updated", post });
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