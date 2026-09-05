import express from "express";
import isAuth from "../middleware/isAuth.js";
import {
  getDashboardStats,
  getEngagementTrend,
  getTopPosts,
  getVisibilityBreakdown,
  getPostingHours,
} from "../controllers/dashboardControllers.js";

const router = express.Router();

router.get("/stats", isAuth, getDashboardStats);
router.get("/trend", isAuth, getEngagementTrend);
router.get("/top-posts", isAuth, getTopPosts);
router.get("/visibility-breakdown", isAuth, getVisibilityBreakdown);
router.get("/posting-hours", isAuth, getPostingHours);

export default router;