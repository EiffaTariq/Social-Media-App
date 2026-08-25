import Icon from "../icons/Icon.jsx";
import { useState } from "react";
import { usePosts } from "../context/PostsContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import CommentItem from "../components/CommentItem.jsx";

export default function PostDetailPage({ post, onBack }) {
  const { toggleLike, submitComment } = usePosts();
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

   async function handleLike() {
    try {
      await toggleLike(post._id, user._id);
    } catch (err) {
      setError("Couldn't like this post. Try again.");
    }
  }
  async function handleCommentSubmit(e) {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitComment(post._id, user._id, commentText.trim());
      setCommentText("");
      setShowCommentBox(false);
    } catch (err) {
      setError("Couldn't post comment. Try again.");
    } finally {
      setSubmitting(false);
    }
  }
 
  return (
    <div className="post-detail">
      <button className="back-btn" onClick={onBack}>&larr; Back</button>
      <img src={post.image} alt={post.caption} className="post-detail-img" />
      <p className="cap">{post.caption}</p>

      <div className="post-detail-icons">
        <button className="icon-btn tooltip" data-tip="Like" onClick={handleLike}>
          <Icon.Heart /> {post.likes?.length || 0}
        </button>
        <button className="icon-btn tooltip" data-tip="Comment" onClick={() => setShowCommentBox((s) => !s)}>
          <Icon.Chat /> {post.comments?.length || 0}
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}

      {showCommentBox && (
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            disabled={submitting}
          />
          <button type="submit" disabled={submitting}>
            {submitting ? "Posting..." : "Post"}
          </button>
        </form>
      )}

    <div className="comment-list">
    {post.comments?.map((c) => (
    <CommentItem key={c._id} postId={post._id} comment={c} />
    ))}
    </div>
    </div>
  );
}

