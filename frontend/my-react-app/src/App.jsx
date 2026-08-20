import { useState } from "react";
import { usePosts } from "./context/PostsContext.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { useStatuses } from "./context/StatusContext.jsx";
import Rail from "./components/Rail.jsx";
import BottomNav from "./components/BottomNav.jsx";
import TopBar from "./components/TopBar.jsx";
import FeedPage from "./pages/FeedPage.jsx";
import ActivityPage from "./pages/ActivityPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import UpdatesPage from "./pages/UpdatesPage.jsx";
import PostDetailPage from "./pages/PostDetailPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import StatusViewer from "./components/StatusViewer.jsx";

const PAGES = {
  feed: FeedPage,
  updates: UpdatesPage,
  activity: ActivityPage,
  profile: ProfilePage,
};

export default function App() {

  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState("login");

  const { posts } = usePosts();
  const { uploading } = useStatuses();
  const [selectedPostId, setSelectedPostId] = useState(null);
  const selectedPost = posts.find((p) => p._id === selectedPostId) || null;
  const [active, setActive] = useState("feed");
  const [statusGroup, setStatusGroup] = useState(null);
  // When set, the Profile page shows this user (e.g. opened from search)
  // instead of the logged-in person's own profile.
  const [viewedUserId, setViewedUserId] = useState(null);
  const Page = PAGES[active];

  const goToProfile = (id) => {
    setViewedUserId(id);
    setActive("profile");
  };

  const handleSetActive = (key) => {
    if (key === "profile") setViewedUserId(null);
    setActive(key);
  };

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
      <Rail active={active} setActive={handleSetActive} />
      <main className="main">
        <TopBar onOpenProfile={goToProfile} />
        {selectedPost
        ? <PostDetailPage post={selectedPost} onBack={() => setSelectedPostId(null)} />
        : active === "profile"
        ? <Page userId={viewedUserId} onOpenPost={(p) => setSelectedPostId(p._id)} onOpenStatusGroup={setStatusGroup} />
        : <Page onOpenPost={(p) => setSelectedPostId(p._id)} onOpenStatusGroup={setStatusGroup} />}
        {statusGroup && (
        <StatusViewer group={statusGroup} onClose={() => setStatusGroup(null)} />
        )}
      </main>
      <BottomNav active={active} setActive={handleSetActive} />
      {uploading && (
        <div className="status-upload-bar">
          <span className="status-upload-spinner" />
          Posting status…
        </div>
      )}
    </div>
  );
}