import { posts, avatar } from "../data.js";
import { useState } from "react";
import Icon from "../icons/Icon.jsx";
import { usePosts } from "../context/PostsContext.jsx";
import { CURRENT_USER } from "../data.js";
import PostFormModal from "../components/PostFormModal.jsx"; // new file, see below

const { posts, addPost, updatePost, deletePost } = usePosts();
const myPosts = posts.filter((p) => p.owner === CURRENT_USER);

const [showAddPost, setShowAddPost] = useState(false);
const [showAddStatus, setShowAddStatus] = useState(false);
const [editingPost, setEditingPost] = useState(null);
const [deleteMode, setDeleteMode] = useState(false);


export default function ProfilePage() {
  return (
    <div>
      <div className="cover">
        <img src={avatar(37)} alt="You" />
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
      <div className="grid3">
        {posts.map((p) => (
          <img key={p.id} src={p.img} alt="" />
        ))}
      </div>
    </div>
  );
}

function handleGridClick(post) {
  if (deleteMode) {
    deletePost(post.id);
    setDeleteMode(false);
  } else {
    setEditingPost(post);
  }
}