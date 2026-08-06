import PostCard from "../components/PostCard.jsx";
// import { posts } from "../data.js";
import { usePosts } from "../context/PostsContext.jsx";

export default function FeedPage({ onOpenPost }) {
  const { posts } = usePosts();
  return (
    <div>
      <div className="page-head">
        
        <h1>What your circle is up to</h1>
        <p>Moments from people</p>
      </div>
      <div className="masonry">
        {posts.map((p) => (
          <PostCard key={p.id} p={p} onClick={() => onOpenPost(p)}/>
        ))}
      </div>
    </div>
  );
}