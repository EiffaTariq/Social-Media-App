import { useState } from "react";
import Icon from "../icons/Icon.jsx";
import { usePosts } from "../context/PostsContext.jsx";
import { avatar, CURRENT_USER } from "../data.js";
import PostFormModal from "../components/PostFormModal.jsx";
import myAvatar from "../assets/images/profile.jfif";


export default function ProfilePage() {
  const { posts, addPost, updatePost, deletePost } = usePosts();
  const myPosts = posts.filter((p) => p.owner === CURRENT_USER);

  const [showAddPost, setShowAddPost] = useState(false);
  const [showAddStatus, setShowAddStatus] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [deleteMode, setDeleteMode] = useState(false);

  function handleGridClick(post) {
  if (deleteMode) {
    deletePost(post.id);
    setDeleteMode(false);
  } else {
    setEditingPost(post);
  }
}
  return (
    <div>
      <div className="cover">
        <img src={myAvatar} alt="You" />
      </div>
      <h2 className="profile-name">Eiffa Tariq</h2>
      <p className="profile-handle">@iffy · Lahore, Pakistan</p>
      <p className="profile-bio">
        Collecting corners worth remembering — cafés, staircases, and the moments. Here mostly for the photos.
      </p>
      <div className="stat-row">
        <div>
          <b>142</b>
          <span>POSTS</span>
        </div>
        <div>
          <b>2.4k</b>
          <span>FOLLOWERS</span>
        </div>
        <div>
          <b>318</b>
          <span>FOLLOWING</span>
        </div>
      </div>
      <button className="edit-btn">Edit profile</button>
      <div className="profile-actions">
        <button className="action-btn" onClick={() => setShowAddPost(true)}>
          <Icon.Plus /> Add post
        </button>
        <button className="action-btn" onClick={() => setShowAddStatus(true)}>
          <Icon.Star /> Add status
        </button>
        <button className="action-btn danger" onClick={() => setDeleteMode(!deleteMode)}>
          <Icon.X /> {deleteMode ? "Cancel delete" : "Delete post"}
        </button>
      </div>

      <div className="grid3">
        {myPosts.map((p) => (
          <img key={p.id} src={p.img} alt="" onClick={() => handleGridClick(p)} style={{ cursor: "pointer" }} />
        ))}
      </div>

      {showAddPost && (
        <PostFormModal onSubmit={addPost} onClose={() => setShowAddPost(false)} />
      )}
      {showAddStatus && (
        <PostFormModal statusOnly onSubmit={(d) => addPost({ ...d, isStatus: true })} onClose={() => setShowAddStatus(false)} />
      )}
      {editingPost && (
        <PostFormModal
          initialData={editingPost}
          onSubmit={(d) => updatePost(editingPost.id, d)}
          onClose={() => setEditingPost(null)}
        />
      )}
    </div>
  );
}

