import { Post } from "../models/postModel.js";
import { User } from "../models/userModel.js";
import TryCatch from "../utils/TryCatch.js";

// Helper: turn "7d" | "30d" | "90d" | "all" into a Mongo date filter
const getDateFilter = (range) => {
  if (range === "all") return {};
  const days = { "7d": 7, "30d": 30, "90d": 90 }[range] || 30;
  const since = new Date();
  since.setDate(since.getDate() - days);
  return { createdAt: { $gte: since } };
};

export const getDashboardStats = TryCatch(async (req, res) => {
  const { userId, range = "30d" } = req.query;
  const match = { owner: userId, ...getDateFilter(range) };

  const posts = await Post.find(match);
  const totalPosts = posts.length;
  const totalLikes = posts.reduce((sum, p) => sum + p.likes.length, 0);
  const totalComments = posts.reduce((sum, p) => sum + p.comments.length, 0);
  const user = await User.findById(userId).select("followers");

  res.json({
    totalPosts,
    totalLikes,
    totalComments,
    totalFollowers: user?.followers.length || 0,
    engagementRate: totalPosts ? ((totalLikes + totalComments) / totalPosts).toFixed(1) : 0,
  });
});

// for the LINE CHART
export const getEngagementTrend = TryCatch(async (req, res) => {
  const { userId, range = "30d" } = req.query;
  const match = { owner: new (await import("mongoose")).default.Types.ObjectId(userId), ...getDateFilter(range) };

  const data = await Post.aggregate([
    { $match: match },
    {
      $project: {
        day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        likesCount: { $size: "$likes" },
        commentsCount: { $size: "$comments" },
      },
    },
    {
      $group: {
        _id: "$day",
        posts: { $sum: 1 },
        likes: { $sum: "$likesCount" },
        comments: { $sum: "$commentsCount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({ trend: data });
});

// for the BAR CHART
export const getTopPosts = TryCatch(async (req, res) => {
  const { userId, range = "30d" } = req.query;
  const match = { owner: userId, ...getDateFilter(range) };

  const posts = await Post.find(match).select("caption likes comments createdAt");
  const ranked = posts
    .map((p) => ({
      id: p._id,
      caption: p.caption.slice(0, 25) + (p.caption.length > 25 ? "…" : ""),
      likes: p.likes.length,
      comments: p.comments.length,
      engagement: p.likes.length + p.comments.length,
    }))
    .sort((a, b) => b.engagement - a.engagement)
    .slice(0, 5);

  res.json({ topPosts: ranked });
});

//for the PIE/DONUT CHART
export const getVisibilityBreakdown = TryCatch(async (req, res) => {
  const { userId } = req.query;
  const data = await Post.aggregate([
    { $match: { owner: new (await import("mongoose")).default.Types.ObjectId(userId) } },
    { $group: { _id: "$visibility", count: { $sum: 1 } } },
  ]);
  res.json({ breakdown: data });
});

//bonus bar chart
export const getPostingHours = TryCatch(async (req, res) => {
  const { userId } = req.query;
  const data = await Post.aggregate([
    { $match: { owner: new (await import("mongoose")).default.Types.ObjectId(userId) } },
    { $group: { _id: { $hour: "$createdAt" }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  res.json({ hours: data });
});

export const getProfileInsights = TryCatch(async (req, res) => {
  const { userId } = req.query;
  const posts = await Post.find({ owner: userId });

  if (posts.length === 0) return res.json({ insights: null });

  const mostCommented = posts.reduce((a, b) => (b.comments.length > a.comments.length ? b : a));

  let fastestEngaged = null;
  let fastestGapMs = Infinity;
  posts.forEach((p) => {
    if (p.comments.length === 0) return;
    const firstCommentTime = new Date(
      Math.min(...p.comments.map((c) => new Date(c.createdAt).getTime()))
    );
    const gap = firstCommentTime - new Date(p.createdAt);
    if (gap < fastestGapMs) {
      fastestGapMs = gap;
      fastestEngaged = p;
    }
  });

  const STOPWORDS = new Set(["the","a","an","is","in","on","of","and","to","for","with","my","this","that","was","at","it"]);
  const freq = {};
  posts.forEach((p) => {
    p.caption
      .toLowerCase()
      .replace(/[^a-z0-9\s#]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w))
      .forEach((w) => (freq[w] = (freq[w] || 0) + 1));
  });
  const topKeyword = Object.entries(freq).sort((a, b) => b[1] - a[1])[0] || null;

  res.json({
    insights: {
      mostLikedPost: posts.reduce((a, b) => (b.likes.length > a.likes.length ? b : a)),
      mostCommentedPost: mostCommented,
      fastestEngagedPost: fastestEngaged,
      fastestEngagedMinutes: fastestGapMs === Infinity ? null : Math.round(fastestGapMs / 60000),
      topKeyword: topKeyword ? { word: topKeyword[0], count: topKeyword[1] } : null,
    },
  });
});