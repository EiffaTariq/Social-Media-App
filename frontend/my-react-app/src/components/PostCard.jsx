import Icon from "../icons/Icon.jsx";
import { usePosts } from "../context/PostsContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useUI } from "../context/UIContext.jsx";

export default function PostCard({ p }) {
  const { user } = useAuth();
  const { toggleLike } = usePosts();
  const liked = p.likes?.includes(user._id);

  async function handleLike(e) {
    e.stopPropagation();
    try {
      await toggleLike(p._id, user._id);
    } catch (err) {
      console.error("Like failed", err);
    }
  }

  return (
    <article className="post" onClick={() => openPost(p)}>
      <img src={p.image} alt={p.caption} loading="lazy" />
      <div className="body">
        <p className="cap">{p.caption}</p>
        <div className="meta">
          <div className="authorline">
            <span>{p.owner?.name}</span>
          </div>
          <div className="post-actions">
            <button className={liked ? "liked" : ""} onClick={handleLike}>
              <Icon.Heart style={{ fill: liked ? "currentColor" : "none" }} />
              {p.likes?.length || 0}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}