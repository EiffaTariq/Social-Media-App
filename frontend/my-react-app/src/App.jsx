import { useState } from "react";
import { usePosts } from "./context/PostsContext.jsx";
import Rail from "./components/Rail.jsx";
import BottomNav from "./components/BottomNav.jsx";
import TopBar from "./components/TopBar.jsx";
import FeedPage from "./pages/FeedPage.jsx";
import DiscoverPage from "./pages/DiscoverPage.jsx";
import ActivityPage from "./pages/ActivityPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import PostDetailPage from "./pages/PostDetailPage.jsx";
import StatusViewer from "./components/StatusViewer.jsx";

const PAGES = {
  feed: FeedPage,
  discover: DiscoverPage,
  activity: ActivityPage,
  profile: ProfilePage,
};
export default function App() {
  const { posts } = usePosts();
  const [selectedPostId, setSelectedPostId] = useState(null);
  const selectedPost = posts.find((p) => p._id === selectedPostId) || null;
  const [active, setActive] = useState("feed");
  const [statusGroup, setStatusGroup] = useState(null);
  const Page = PAGES[active];

  return (
    <div className="shell">
      <Rail active={active} setActive={setActive} onOpenStatusGroup={setStatusGroup} />
      <main className="main">
        <TopBar />
        {selectedPost
        ? <PostDetailPage post={selectedPost} onBack={() => setSelectedPostId(null)} />
        : <Page onOpenPost={(p) => setSelectedPostId(p._id)} />}
        {statusGroup && (
        <StatusViewer group={statusGroup} onClose={() => setStatusGroup(null)} />
        )}
      </main>
      <BottomNav active={active} setActive={setActive} />
    </div>
  );
}
