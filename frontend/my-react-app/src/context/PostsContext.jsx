import { createContext, useContext, useEffect, useState } from "react";
import {
  getAllPosts,
  createPost,
  likePost,
  addComment as apiAddComment,
  editComment as apiEditComment,
  deleteComment as apiDeleteComment,
  replyToComment as apiReplyToComment,
  updatePostCaption,
  deletePostById,
} from "../api.js";

const PostsContext = createContext(null);

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    getAllPosts()
      .then(setPosts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const addPost = async (caption, ownerId, image) => {
    const { post } = await createPost(caption, ownerId, image);
    setPosts((prev) => [post, ...prev]);
  };

  const updatePost = async (postId, caption) => {
    try {
      const { post } = await updatePostCaption(postId, caption);
      setPosts((prev) => prev.map((p) => (p._id === postId ? post : p)));
    } catch (err) {
      setActionError(err.message);
      throw err;
    }
  };

  const deletePost = async (postId) => {
    try {
      await deletePostById(postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      setActionError(err.message);
      throw err;
    }
  };

  const toggleLike = async (postId, userId) => {
    const { post } = await likePost(postId, userId);
    setPosts((prev) => prev.map((p) => (p._id === postId ? post : p)));
  };

  const submitComment = async (postId, userId, comment) => {
    const { post } = await apiAddComment(postId, userId, comment);
    setPosts((prev) => prev.map((p) => (p._id === postId ? post : p)));
  };

  const editPostComment = async (postId, commentId, comment) => {
    const { post } = await apiEditComment(postId, commentId, comment);
    setPosts((prev) => prev.map((p) => (p._id === postId ? post : p)));
  };

  const removeComment = async (postId, commentId) => {
    const { post } = await apiDeleteComment(postId, commentId);
    setPosts((prev) => prev.map((p) => (p._id === postId ? post : p)));
  };

  const replyComment = async (postId, commentId, userId, comment) => {
    const { post } = await apiReplyToComment(postId, commentId, userId, comment);
    setPosts((prev) => prev.map((p) => (p._id === postId ? post : p)));
  };

  return (
    <PostsContext.Provider
      value={{
        posts,
        loading,
        error,
        actionError,
        addPost,
        updatePost,
        deletePost,
        toggleLike,
        submitComment,
        editPostComment,
        removeComment,
        replyComment,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
}

export const usePosts = () => useContext(PostsContext);