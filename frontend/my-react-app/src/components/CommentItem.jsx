import { useState } from "react";
import DotMenu from "./DotMenu.jsx";
import { usePosts } from "../context/PostsContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function CommentItem({ postId, comment }) {
  const { editPostComment, removeComment, replyComment } = usePosts();

  const { user } = useAuth();
  const [mode, setMode] = useState(null); // null | "edit" | "reply"
  const [text, setText] = useState(comment.comment);
  const [replyText, setReplyText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const isOwner = comment.user?._id === user._id;

  async function handleSaveEdit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await editPostComment(postId, comment._id, text.trim());
      setMode(null);
    } catch {
      setError("Couldn't update comment. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    setBusy(true);
    setError(null);
    try {
      await removeComment(postId, comment._id);
    } catch {
      setError("Couldn't delete comment. Try again.");
      setBusy(false);
    }
  }

  async function handleSendReply(e) {
    e.preventDefault();
    if (!replyText.trim()) return;
    setBusy(true);
    setError(null);
    try {
      await replyComment(postId, comment._id, user._id, replyText.trim());
      setReplyText("");
      setMode(null);
    } catch {
      setError("Couldn't post reply. Try again.");
    } finally {
      setBusy(false);
    }
  }

  const menuOptions = [
    { label: "Reply", onClick: () => setMode("reply") },
    ...(isOwner ? [{ label: "Edit", onClick: () => { setText(comment.comment); setMode("edit"); } }] : []),
    ...(isOwner ? [{ label: "Delete", onClick: handleDelete, danger: true }] : []),
  ];

  return (
    <div className="comment-item">
      <div className="comment-row">
        {mode === "edit" ? (
          <form className="comment-edit-form" onSubmit={handleSaveEdit}>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={busy}
              autoFocus
            />
            <button type="submit" disabled={busy}>Save</button>
            <button type="button" onClick={() => setMode(null)} disabled={busy}>Cancel</button>
          </form>
        ) : (
          <p className="comment-text">
            <b>{comment.user?.name || "Someone"}:</b> {comment.comment}
          </p>
        )}
        <DotMenu options={menuOptions} />
      </div>

      {error && <p className="error-text small">{error}</p>}

      {mode === "reply" && (
        <form className="comment-reply-form" onSubmit={handleSendReply}>
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder={`Reply to ${comment.user?.name || "this comment"}...`}
            disabled={busy}
            autoFocus
          />
          <button type="submit" disabled={busy}>{busy ? "Sending..." : "Reply"}</button>
        </form>
      )}

      {comment.replies?.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map((r) => (
            <p key={r._id} className="comment-reply-item">
              <b>{r.user?.name || "Someone"}:</b> {r.comment}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}