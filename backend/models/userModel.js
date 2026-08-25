import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 24,
      match: /^[a-z0-9_.]+$/,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    bio: {
      type: String,
      default: "",
      maxlength: 160,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    profilePic: {
      id: String,
      url: String,
    },
    posts: 
    [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Post"
    }],
    followRequests: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ],
    notifications: [
      {
        type: { type: String, enum: ["follow_request", "follow_accept"], default: "follow_request" },
        from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        message: String,
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
      },
    ],

  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);