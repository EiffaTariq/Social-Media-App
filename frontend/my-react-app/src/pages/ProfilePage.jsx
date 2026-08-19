import { useState, useEffect } from "react";
import Icon from "../icons/Icon.jsx";
import { usePosts } from "../context/PostsContext.jsx";
import { avatar } from "../data.js";
import PostFormModal from "../components/PostFormModal.jsx";
import DotMenu from "../components/DotMenu.jsx";
import { useStatuses } from "../context/StatusContext.jsx";
import myAvatar from "../assets/images/profile.jfif";
import { useAuth } from "../context/AuthContext.jsx";
//import { CURRENT_USER_ID } from "../currentUser.js";

export default function ProfilePage() {
  const { posts, loading, error, addPost, updatePost, deletePost } = usePosts();
  const { addStatus, uploading } = useStatuses();
  const myPosts = posts.filter((p) => p.owner?._id === user._id);

  const { user } = useAuth();
  const [meError, setMeError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [showAddPost, setShowAddPost] = useState(false);
  const [showAddStatus, setShowAddStatus] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const [me, setMe] = useState(null);
  useEffect(() => {
    fetch(`http://localhost:7000/api/user/${user._id}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then(setMe)
      .catch((err) => setMeError(err.message));
  }, []);

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
    } catch (err) {
      setCreateError("Couldn't create post. Try again.");
    } finally {
      setCreating(false);
    }
  }

  async function handleAddStatus({ cap, img }) {
    try {
      await addStatus(cap, user._id, img);
    } catch (err) {
      setActionError("Couldn't post status. Try again.");
    }
  }

  return (
    <div>
      <div className="cover">
        <img src={myAvatar} alt="You" />
      </div>
      <h2 className="profile-name">{me?.name || "Loading..."}</h2>
      <p className="profile-handle">@iffy · Lahore, Pakistan</p>
      <p className="profile-bio">
        Collecting corners worth remembering — cafés, staircases, and the moments. Here mostly for the photos.
      </p>
      <div className="stat-row">
        <div><b>142</b><span>POSTS</span></div>
        <div><b>2.4k</b><span>FOLLOWERS</span></div>
        <div><b>318</b><span>FOLLOWING</span></div>
      </div>
      <button className="edit-btn" onClick={() => setShowEditProfile(true)}>Edit profile</button>
      {showEditProfile && (
        <EditProfileModal
          user={me}
          onSubmit={async (data) => {
            await fetch(`http://localhost:7000/api/user/${user._id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            setMe((prev) => ({ ...prev, ...data }));
          }}
          onClose={() => setShowEditProfile(false)}
        />
      )}
      <div className="profile-actions">
        <button className="action-btn" onClick={() => setShowAddPost(true)}>
          <Icon.Plus /> Add post
        </button>
        <button className="action-btn" onClick={() => setShowAddStatus(true)}>
          <Icon.Star /> Add status
        </button>
      </div>
      {actionError && <p className="error-text">{actionError}</p>}

      <div className="grid3">
        {myPosts.map((p) => (
          <div
            key={p._id}
            className={"grid-tile" + (deletingId === p._id ? " deleting" : "")}
            style={{ position: "relative" }}
          >
            <img src={p.image} alt={p.caption} loading="lazy" />
            <div className="grid-tile-caption">{p.caption}</div>
            <DotMenu
              className="grid-tile-menu"
              options={[
                { label: "Edit", onClick: () => setEditingPost(p) },
                { label: "Delete", onClick: () => handleDeletePost(p), danger: true },
              ]}
            />
          </div>
        ))}
      </div>

      {showAddPost && (
        <PostFormModal onSubmit={handleAddPost} onClose={() => setShowAddPost(false)} submitting={creating} />
      )}
      {createError && <p className="error-text">{createError}</p>}
      {showAddStatus && (
        <PostFormModal statusOnly onSubmit={handleAddStatus} onClose={() => setShowAddStatus(false)} submitting={uploading} />
      )}
      {editingPost && (
        <PostFormModal
          initialData={editingPost}
          onSubmit={(d) => updatePost(editingPost._id, d.cap)}
          onClose={() => setEditingPost(null)}
        />
      )}
    </div>
  );
}