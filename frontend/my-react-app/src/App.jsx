import { useState } from "react";
import { usePosts } from "./context/PostsContext.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { useStatuses } from "./context/StatusContext.jsx";
import { useUI } from "./context/UIContext.jsx";
import Rail from "./components/Rail.jsx";
import BottomNav from "./components/BottomNav.jsx";
import TopBar from "./components/TopBar.jsx";
import FeedPage from "./pages/FeedPage.jsx";
import ActivityPage from "./pages/ActivityPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import UpdatesPage from "./pages/UpdatesPage.jsx";
import PostDetailPage from "./pages/PostDetailPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import StatusViewer from "./components/StatusViewer.jsx";

const PAGES = {
  feed: FeedPage,
  updates: UpdatesPage,
  activity: ActivityPage,
  profile: ProfilePage,
  dashboard: DashboardPage
};

export default function App() {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState("login");

  const { posts } = usePosts();
  const { uploading } = useStatuses();
  const { selectedPostId, statusGroup, viewedUserId, active, closePost, closeStatusGroup, goTo } = useUI();
  const selectedPost = posts.find((p) => p._id === selectedPostId) || null;
  const Page = PAGES[active] || NotFoundPage;

  if (loading) return <div className="app-loading">Loading...</div>;

  if (!user) {
    return authMode === "login" ? (
      <LoginPage onSwitchToSignup={() => setAuthMode("signup")} />
    ) : (
      <SignupPage onSwitchToLogin={() => setAuthMode("login")} />
    );
  }

  return (
    <div className="shell">
      <Rail active={active} setActive={goTo} />
      <main className="main">
        <TopBar />
        {selectedPost
          ? <PostDetailPage post={selectedPost} onBack={closePost} />
          : active === "profile"
          ? <Page userId={viewedUserId} />
          : <Page onBack={() => goTo("feed")} />}
        {statusGroup && <StatusViewer group={statusGroup} onClose={closeStatusGroup} />}
      </main>
      <BottomNav active={active} setActive={goTo} />
      {uploading && (
        <div className="status-upload-bar">
          <span className="status-upload-spinner" />
          Posting status…
        </div>
      )}
    </div>
  );
}