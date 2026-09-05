import { useState, useEffect } from "react";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";
import { useAuth } from "../context/AuthContext.jsx";
import {
  getDashboardStats, getEngagementTrend, getTopPosts,
  getVisibilityBreakdown, getProfileInsights,
} from "../api.js";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b"];
const RANGES = [
  { key: "7d", label: "7 Days" },
  { key: "30d", label: "30 Days" },
  { key: "90d", label: "90 Days" },
  { key: "all", label: "All Time" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [range, setRange] = useState("30d");   // <-- the interactive filter
  const [stats, setStats] = useState(null);
  const [trend, setTrend] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [breakdown, setBreakdown] = useState([]);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    if (!user) return;
    getDashboardStats(user._id, range).then(setStats);
    getEngagementTrend(user._id, range).then((d) => setTrend(d.trend));
    getTopPosts(user._id, range).then((d) => setTopPosts(d.topPosts));
    getVisibilityBreakdown(user._id).then((d) => setBreakdown(d.breakdown));
    getProfileInsights(user._id).then((d) => setInsights(d.insights));
  }, [user, range]);   // <-- refetches whenever the filter changes

  if (!stats) return <div className="dashboard-loading">Loading dashboard…</div>;

  return (
    <div className="dashboard-page">
      {/* Filter */}
      <div className="dashboard-filter">
        {RANGES.map((r) => (
          <button
            key={r.key}
            className={"range-btn" + (range === r.key ? " active" : "")}
            onClick={() => setRange(r.key)}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="stat-cards">
        <StatCard label="Posts" value={stats.totalPosts} />
        <StatCard label="Likes" value={stats.totalLikes} />
        <StatCard label="Comments" value={stats.totalComments} />
        <StatCard label="Followers" value={stats.totalFollowers} />
        <StatCard label="Engagement/Post" value={stats.engagementRate} />
      </div>

      {/* Line chart: trend */}
      <div className="chart-card">
        <h3>Engagement Trend</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="likes" stroke="#6366f1" />
            <Line type="monotone" dataKey="comments" stroke="#22c55e" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar chart: top posts */}
      <div className="chart-card">
        <h3>Top Performing Posts</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={topPosts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="caption" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="likes" fill="#6366f1" />
            <Bar dataKey="comments" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie chart: visibility */}
      <div className="chart-card">
        <h3>Post Visibility Breakdown</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={breakdown} dataKey="count" nameKey="_id" outerRadius={90} innerRadius={50} label>
              {breakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Profile insights */}
      {insights && (
        <div className="insights-card">
          <h3>Profile Insights</h3>
          <p>Most liked post: "{insights.mostLikedPost?.caption}" ({insights.mostLikedPost?.likes.length} likes)</p>
          <p>Most commented post: "{insights.mostCommentedPost?.caption}" ({insights.mostCommentedPost?.comments.length} comments)</p>
          {insights.fastestEngagedPost && (
            <p>Fastest engagement: got its first comment in {insights.fastestEngagedMinutes} min</p>
          )}
          {insights.topKeyword && (
            <p>Trending keyword in your captions: "{insights.topKeyword.word}" (used {insights.topKeyword.count}x)</p>
          )}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}