import PostCard from "../components/PostCard.jsx";
import { usePosts } from "../context/PostsContext.jsx";
import { PostCardSkeleton } from "../components/Skeleton.jsx";

export default function FeedPage() {
  const { posts, loading, error } = usePosts();

  return (
    <div>
      <div className="page-head">
        <h1>What your circle is up to</h1>
        <p>Moments from people</p>
      </div>

      {loading && (
        <div className="masonry">
        {Array.from({ length: 6 }).map((_, i) => <PostCardSkeleton key={i} />)}
        </div>
      )}
      {error && <p className="error-text">{error}</p>}
      
      {!loading && !error && posts.length === 0 && (
        <p className="updates-empty">No posts yet. Follow people or create your first post to see it here.</p>
      )}
      {!loading && !error && posts.length > 0 && (
        <div className="masonry">
          {posts.map((p) => (
            <PostCard key={p._id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}