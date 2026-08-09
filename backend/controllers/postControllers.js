// import {Post} from '../models/postModel.js';
// import TryCatch from '../utils/TryCatch.js';
// import getDataUrl from '../utils/urlGenerator.js';
// import cloudinary from 'cloudinary';
// import { User } from '../models/userModel.js';


// export const newPost = TryCatch(async (req, res) => {
//   const { caption } = req.body;

//   const ownerId = req.user._id;

//   const file = req.file;
//   const fileUrl = getDataUrl(file);

//   let option;

//   const type = req.query.type;
//   if (type === "reel") {
//     option = {
//       resource_type: "video",
//     };
//   } else {
//     option = {};
//   }

//   const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content, option);

//   const post = await Post.create({
//     caption,
//     post: {
//       id: myCloud.public_id,
//       url: myCloud.secure_url,
//     },
//     owner: ownerId,
//     type,
//   });

//   res.status(201).json({
//     message: "Post created",
//     post,
//   });
// });


// // export const newPost = TryCatch(async (req, res) => {
// //   try {
// //     const { caption, type } = req.body;

// //     if (!req.file) {
// //       return res.status(400).json({ message: "File is required" });
// //     }

//   //   const newPost = await Post.create({
//   //     caption,
//   //     type,
//   //     post: { url: `/uploads/${req.file.filename}` },
//   //     owner: req.user.id,
//   //   });

//   //   // push post into user's profile
//   //   const user = await User.findById(req.user.id);
//   //   user.posts.push(newPost._id);
//   //   await user.save();

//   //   res.status(201).json({ message: "Post created successfully", post: newPost });
//   // } catch (err) {
//   //   console.error("❌ createPost error:", err.message);
//   //   res.status(500).json({ message: "Something went wrong" });
//   // }
// //});


// // export const newPost = TryCatch(async (req, res) => {
// //   try {
// //     const { caption, type, userId } = req.body;

// //     if (!userId) {
// //       return res.status(401).json({ message: "User ID is required" });
// //     }

// //     const user = await User.findById(userId);
// //     if (!user) {
// //       return res.status(401).json({ message: "Invalid User ID" });
// //     }

// //     if (!req.file) {
// //       return res.status(400).json({ message: "File is required" });
// //     }

// //     const newPost = await Post.create({
// //       caption,
// //       type,
// //       post: { url: `/uploads/${req.file.filename}` },
// //       owner: userId,
// //     });

// //     // Push post into user's profile
// //     user.posts.push(newPost._id);
// //     await user.save();

// //     res.status(201).json({ message: "Post created successfully", post: newPost });
// //   } catch (err) {
// //     console.error("❌ createPost error:", err.message);
// //     res.status(500).json({ message: "Something went wrong" });
// //   }
// // });


// export const deletePost = TryCatch(async (req, res) => {
//   const post = await Post.findById(req.params.id);

//   if (!post)
//     return res.status(404).json({
//       message: "No post with this id",
//     });

//   if (post.owner.toString() !== req.user._id.toString())
//     return res.status(403).json({
//       message: "Unauthorized",
//     });

//   await cloudinary.v2.uploader.destroy(post.post.id);

//   await post.deleteOne();

//   res.json({
//     message: "Post Deleted",
//   });
// });

// export const getAllPosts = TryCatch(async (req, res) => {
//   const posts = await Post.find({ type: "post" })
//     .sort({ createdAt: -1 })
//     .populate("owner", "-password")
//     .populate({
//       path: "comments.user",
//       select: "-password",
//     });

//   const reels = await Post.find({ type: "reel" })
//     .sort({ createdAt: -1 })
//     .populate("owner", "-password")
//     .populate({
//       path: "comments.user",
//       select: "-password",
//     });

//   res.json({ posts, reels });
// });

// export const likeUnlikePost = TryCatch(async (req, res) => {
//   const post = await Post.findById(req.params.id);

//   if (!post)
//     return res.status(404).json({
//       message: "There are currently no posts with this id",
//     });

//   if (post.likes.includes(req.user._id)) {
//     const index = post.likes.indexOf(req.user._id);

//     post.likes.splice(index, 1);

//     await post.save();

//     res.json({
//       message: "Unliked post 💙",
//     });
//   } else {
//     post.likes.push(req.user._id);

//     await post.save();

//     res.json({
//       message: "Post liked ❤️",
//     });
//   }
// });


// export const commentonPost = TryCatch(async (req, res) => {
//   const post = await Post.findById(req.params.id);

//   if (!post)
//     return res.status(404).json({
//       message: "No Post with this id",
//     });

//   post.comments.push({
//     user: req.user._id,
//     name: req.user.name,
//     comment: req.body.comment,
//   });

//   await post.save();

//   res.json({
//     message: "Comment Added",
//   });
// });

// export const deleteComment = TryCatch(async (req, res) => {
//   const post = await Post.findById(req.params.id);

//   if (!post)
//     return res.status(404).json({
//       message: "No Post with this id",
//     });

//     //is there comment id
//   if (!req.query.commentId)
//     return res.status(404).json({
//       message: "Please give comment id",
//     });

//   const commentIndex = post.comments.findIndex(
//     (item) => item._id.toString() === req.query.commentId.toString()
//   );

//   //is comment id valid
//   if (commentIndex === -1) {
//     return res.status(400).json({
//       message: "Comment not found",
//     });
//   }

//   const comment = post.comments[commentIndex];

//   if (
//     //isPostOwner trying to delete
//     post.owner.toString() === req.user._id.toString() ||
//     comment.user.toString() === req.user._id.toString()
//   ) {
//     post.comments.splice(commentIndex, 1);

//     await post.save();

//     return res.json({
//       message: "Comment deleted",
//     });
//   } else {
//     return res.status(400).json({
//       message: "Yor are not allowed to delete this comment",
//     });
//   }
// });

// export const editCaption = TryCatch(async (req, res) => {
//   const post = await Post.findById(req.params.id);

//   if (!post)
//     return res.status(404).json({
//       message: "No Post with this id",
//     });

//   if (post.owner.toString() !== req.user._id.toString())
//     return res.status(403).json({
//       message: "You are not owner of this post",
//     });

//   post.caption = req.body.caption;

//   await post.save();

//   res.json({
//     message: "post updated",
//   });
// });


// export const getTimelinePosts = async (req, res) => {
//   const userId = req.params.id
//   try {
//     const currentUserPosts = await PostModel.find({ userId: userId });

//     const followingPosts = await UserModel.aggregate([
//       { 
//         $match: {
//           _id: new mongoose.Types.ObjectId(userId),
//         },
//       },
//       {
//         $lookup: {
//           from: "posts",
//           localField: "following",
//           foreignField: "userId",
//           as: "followingPosts",
//         },
//       },
//       {
//         $project: {
//           followingPosts: 1,
//           _id: 0,
//         },
//       },
//     ]);

//     res.status(200).json(
//       currentUserPosts
//         .concat(...followingPosts[0].followingPosts)
//         .sort((a, b) => {
//           return new Date(b.createdAt) - new Date(a.createdAt);
//         })
//     );
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };
  






// export const getUserPosts = TryCatch(async (req, res) => {
//   const { id } = req.params;

//   // 1️⃣ Find the user first
//   const user = await User.findById(id)
//     .select("-password")
//     .populate("followers", "name email") // only return name+email of followers
//     .populate("followings", "name email");

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });
//   }

//   // 2️⃣ Fetch all posts of this user
//   const posts = await Post.find({ owner: id }).sort({ createdAt: -1 });

//   res.json({
//     success: true,
//     user: {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       followers: user.followers,
//       followings: user.followings,
//     },
//     posts,
//   });
// });


import { Post } from "../models/postModel.js";
import { User } from "../models/userModel.js";
import TryCatch from "../utils/TryCatch.js";
import getDataUrl from "../utils/urlGenerator.js";
import cloudinary from "cloudinary";

export const newPost = TryCatch(async (req, res) => {
  const { caption } = req.body;
  const ownerId = req.user._id; // comes from isAuth

  const file = req.file;
  const fileUrl = getDataUrl(file);

  const type = req.query.type;
  const option = type === "reel" ? { resource_type: "video" } : {};

  const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content, option);

  const post = await Post.create({
    caption,
    post: {
      id: myCloud.public_id,
      url: myCloud.secure_url,
    },
    owner: ownerId,
    type,
  });

  res.status(201).json({
    message: "Post created",
    post,
  });
});


export const deletePost = TryCatch(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post)
    return res.status(404).json({
      message: "No post with this id",
    });

  if (post.owner.toString() !== req.user._id.toString())
    return res.status(403).json({
      message: "Unauthorized",
    });

  await cloudinary.v2.uploader.destroy(post.post.id);

  await post.deleteOne();

  res.json({
    message: "Post Deleted",
  });
});

export const getAllPosts = TryCatch(async (req, res) => {
  const posts = await Post.find({ type: "post" })
    .sort({ createdAt: -1 })
    .populate("owner", "-password")
    .populate({
      path: "comments.user",
      select: "-password",
    });

  const reels = await Post.find({ type: "reel" })
    .sort({ createdAt: -1 })
    .populate("owner", "-password")
    .populate({
      path: "comments.user",
      select: "-password",
    });

  res.json({ posts, reels });
});

export const likeUnlikePost = TryCatch(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post)
    return res.status(404).json({
      message: "No Post with this id",
    });

  if (post.likes.includes(req.user._id)) {
    const index = post.likes.indexOf(req.user._id);

    post.likes.splice(index, 1);

    await post.save();

    res.json({
      message: "Post Unlike",
    });
  } else {
    post.likes.push(req.user._id);

    await post.save();

    res.json({
      message: "Post liked",
    });
  }
});

export const commentonPost = TryCatch(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post)
    return res.status(404).json({
      message: "No Post with this id",
    });

  post.comments.push({
    user: req.user._id,
    name: req.user.name,
    comment: req.body.comment,
  });

  await post.save();

  res.json({
    message: "Comment Added",
  });
});

export const deleteComment = TryCatch(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post)
    return res.status(404).json({
      message: "No Post with this id",
    });

  if (!req.query.commentId)
    return res.status(404).json({
      message: "Please give comment id",
    });

  const commentIndex = post.comments.findIndex(
    (item) => item._id.toString() === req.query.commentId.toString()
  );

  if (commentIndex === -1) {
    return res.status(400).json({
      message: "Comment not found",
    });
  }

  const comment = post.comments[commentIndex];

  if (
    post.owner.toString() === req.user._id.toString() ||
    comment.user.toString() === req.user._id.toString()
  ) {
    post.comments.splice(commentIndex, 1);

    await post.save();

    return res.json({
      message: "Comment deleted",
    });
  } else {
    return res.status(400).json({
      message: "Yor are not allowed to delete this comment",
    });
  }
});

export const editCaption = TryCatch(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post)
    return res.status(404).json({
      message: "No Post with this id",
    });

  if (post.owner.toString() !== req.user._id.toString())
    return res.status(403).json({
      message: "You are not owner of this post",
    });

  post.caption = req.body.caption;

  await post.save();

  res.json({
    message: "post updated",
  });
});


export const getUserPosts = TryCatch(async (req, res) => {
  const { id } = req.params;

  // 1️⃣ Find the user first
  const user = await User.findById(id)
    .select("-password")
    .populate("followers", "name email") // only return name+email of followers
    .populate("followings", "name email");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // 2️⃣ Fetch all posts of this user
  const posts = await Post.find({ owner: id }).sort({ createdAt: -1 });

  res.json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      followers: user.followers,
      followings: user.followings,
    },
    posts,
  });
});


export const getTimelinePosts = async (req, res) => {
  const userId = req.params.id
  try {
    const currentUserPosts = await PostModel.find({ userId: userId });

    const followingPosts = await UserModel.aggregate([
      { 
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingPosts",
        },
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json(
      currentUserPosts
        .concat(...followingPosts[0].followingPosts)
        .sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
    );
  } catch (error) {
    res.status(500).json(error);
  }
};