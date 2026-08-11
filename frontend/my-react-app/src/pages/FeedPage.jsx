import PostCard from "../components/PostCard.jsx";
import { usePosts } from "../context/PostsContext.jsx";

export default function FeedPage({ onOpenPost }) {
  const { posts, loading, error } = usePosts();

  return (
    <div>
      <div className="page-head">
        <h1>What your circle is up to</h1>
        <p>Moments from people</p>
      </div>

      {loading && <p>Loading posts...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <div className="masonry">
          {posts.map((p) => (
            <PostCard key={p._id} p={p} onClick={() => onOpenPost(p)} />
          ))}
        </div>
      )}
    </div>
  );
}