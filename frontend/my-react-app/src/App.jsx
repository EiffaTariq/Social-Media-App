import { useState } from "react";
import Rail from "./components/Rail.jsx";
import BottomNav from "./components/BottomNav.jsx";
import TopBar from "./components/TopBar.jsx";
import FeedPage from "./pages/FeedPage.jsx";
import DiscoverPage from "./pages/DiscoverPage.jsx";
import ActivityPage from "./pages/ActivityPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import PostDetailPage from "./pages/PostDetailPage.jsx";


const PAGES = {
  feed: FeedPage,
  discover: DiscoverPage,
  activity: ActivityPage,
  profile: ProfilePage,
};
export default function App() {
  const [selectedPost, setSelectedPost] = useState(null);
  const [active, setActive] = useState("feed");
  const Page = PAGES[active];

  return (
    <div className="shell">
      <Rail active={active} setActive={setActive} />
      <main className="main">
        <TopBar />
        {selectedPost
        ? <PostDetailPage post={selectedPost} onBack={() => setSelectedPost(null)} />
        : <Page onOpenPost={setSelectedPost} />}
        
      </main>
      <BottomNav active={active} setActive={setActive} />
    </div>
  );
}
