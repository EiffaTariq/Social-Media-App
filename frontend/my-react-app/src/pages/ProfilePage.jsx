import { useState, useEffect } from "react";
import Icon from "../icons/Icon.jsx";
import { usePosts } from "../context/PostsContext.jsx";
import PostFormModal from "../components/PostFormModal.jsx";
import DotMenu from "../components/DotMenu.jsx";
import { useStatuses } from "../context/StatusContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import EditPostForm from "../components/EditPostForm.jsx";
import { getUserById, updateUserProfile, toggleFollowUser } from "../api.js";

const FALLBACK_AVATAR = "https://api.dicebear.com/7.x/initials/svg?seed=";

export default function ProfilePage({ userId }) {
  const { user, refreshUser } = useAuth();
  const viewingOwnProfile = !userId || userId === user?._id;
  const targetId = userId || user?._id;

  const { posts, loading, error, addPost, updatePost, deletePost } = usePosts();
  const { addStatus, uploading } = useStatuses();

  const [me, setMe] = useState(null);
  const [meError, setMeError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [showAddPost, setShowAddPost] = useState(false);
  const [showAddStatus, setShowAddStatus] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);

  useEffect(() => {
    if (!targetId) return;
    setMe(null);
    setMeError(null);
    getUserById(targetId)
      .then(setMe)
      .catch((err) => setMeError(err.message));
  }, [targetId]);

  const myPosts = posts.filter((p) => p.owner?._id === targetId);
  const isFollowing = me?.followers?.some((f) => (f._id || f) === user?._id);

  async function handleDeletePost(post) {
    setActionError(null);
    setDeletingId(post._id);
    try {
      await deletePost(post._id);
    } catch {
      setActionError("Couldn't delete post. Try again.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleAddPost({ cap, img }) {
    setCreating(true);
    setCreateError(null);
    try {
      await addPost(cap, user._id, img);
    } catch {
      setCreateError("Couldn't create post. Try again.");
    } finally {
      setCreating(false);
    }
  }

  async function handleAddStatus({ cap, img }) {
    try {
      await addStatus(cap, user._id, img);
    } catch {
      setActionError("Couldn't post status. Try again.");
    }
  }

  async function handleToggleFollow() {
    if (!me) return;
    setFollowBusy(true);
    try {
      await toggleFollowUser(me._id);
      const fresh = await getUserById(me._id);
      setMe(fresh);
      refreshUser?.();
    } catch (err) {
      setActionError(err.message || "Couldn't update follow status.");
    } finally {
      setFollowBusy(false);
    }
  }

  const avatarSrc = me?.profilePic?.url || `${FALLBACK_AVATAR}${me?.username || "user"}`;
  if (!me && !meError) {
  return (
    <div>
      <div className="cover"><div className="skeleton-block skeleton-avatar" style={{ width: 96, height: 96 }} /></div>
      <div className="skeleton-block skeleton-line" style={{ width: "40%", margin: "12px auto" }} />
      <div className="skeleton-block skeleton-line" style={{ width: "60%", margin: "0 auto" }} />
    </div>
  );
}
  else{
  return (
    <div>

      <div className="cover">
        <img src={avatarSrc} alt={me?.name || "User"} />
      </div>
      <h2 className="profile-name">{me?.name || (meError ? "User not found" : "Loading...")}</h2>
      {me?.username && <p className="profile-handle">@{me.username}</p>}
      {me?.bio && <p className="profile-bio">{me.bio}</p>}

      <div className="stat-row">
        <div><b>{myPosts.length}</b><span>POSTS</span></div>
        <div><b>{me?.followers?.length ?? 0}</b><span>FOLLOWERS</span></div>
        <div><b>{me?.followings?.length ?? 0}</b><span>FOLLOWING</span></div>
      </div>

      {viewingOwnProfile ? (
        <button className="edit-btn" onClick={() => setShowEditProfile(true)}>
          Edit profile
        </button>
      ) : (
        <button className="edit-btn" onClick={handleToggleFollow} disabled={followBusy}>
          {followBusy ? "..." : isFollowing ? "Unfollow" : "Follow"}
        </button>
      )}

      {showEditProfile && (
        <EditProfileModal
          user={me}
          onSubmit={async (data) => {
            const { user: updated } = await updateUserProfile(user._id, data);
            setMe(updated);
            refreshUser?.();
          }}
          onClose={() => setShowEditProfile(false)}
        />
      )}

      {viewingOwnProfile && (
        <div className="profile-actions">
          <button className="action-btn" onClick={() => setShowAddPost(true)}>
            <Icon.Plus /> Add post
          </button>
          <button className="action-btn" onClick={() => setShowAddStatus(true)}>
            <Icon.Star /> Add status
          </button>
        </div>
      )}
      {actionError && <p className="error-text">{actionError}</p>}


      {myPosts.length === 0 ? (
      <p className="updates-empty">
      {viewingOwnProfile ? "You haven't posted anything yet." : "No posts yet."}
      </p>
      ) : (
      <div className="grid3">
        {myPosts.map((p) => (
          <div
            key={p._id}
            className={"grid-tile" + (deletingId === p._id ? " deleting" : "")}
            style={{ position: "relative" }}
          >
            <img src={p.image} alt={p.caption} loading="lazy" />
            <div className="grid-tile-caption">{p.caption}</div>
            {viewingOwnProfile && (
              <DotMenu
                className="grid-tile-menu"
                options={[
                  { label: "Edit", onClick: () => setEditingPost(p) },
                  { label: "Delete", onClick: () => handleDeletePost(p), danger: true },
                ]}
              />
            )}
          </div>
        ))}
      </div>
      )}

      {showAddPost && (
        <PostFormModal onSubmit={handleAddPost} onClose={() => setShowAddPost(false)} submitting={creating} />
      )}
      {createError && <p className="error-text">{createError}</p>}
      {showAddStatus && (
        <PostFormModal statusOnly onSubmit={handleAddStatus} onClose={() => setShowAddStatus(false)} submitting={uploading} />
      )}
      {editingPost && (
        <EditPostForm
          post={editingPost}
          onSubmit={(data) => updatePost(editingPost._id, data)}
          onClose={() => setEditingPost(null)}
        />
      )}
    </div>
  );
}
}

function EditProfileModal({ user, onSubmit, onClose }) {
  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [preview, setPreview] = useState(user?.profilePic?.url || null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await onSubmit({
        name,
        username,
        bio,
        profilePic: preview ? { url: preview } : undefined,
      });
      onClose();
    } catch (err) {
      setError(err.message || "Couldn't update profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h3>Edit profile</h3>
        {error && <p className="auth-error">{error}</p>}

        {preview && <img src={preview} alt="" className="modal-preview" />}
        <input type="file" accept="image/*" onChange={handleFile} />

        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value.trim())} />
        <textarea placeholder="Bio" value={bio} maxLength={160} onChange={(e) => setBio(e.target.value)} />

        <div className="modal-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
        </div>
      </form>
    </div>
  );
}
