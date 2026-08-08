import { createContext, useContext, useState } from "react";
import { posts as initialPosts } from "../data.js";
import { avatar, CURRENT_USER } from "../data.js";
import myAvatar from "../assets/images/profile.jfif";

const PostsContext = createContext(null);

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState(initialPosts);

  const addPost = (post) =>
    setPosts((prev) => [{ id: Date.now(), owner: CURRENT_USER, likes: 0, av: myAvatar, ...post }, ...prev]);

  const updatePost = (id, updates) =>
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));

  const deletePost = (id) =>
    setPosts((prev) => prev.filter((p) => p.id !== id));

  return (
    <PostsContext.Provider value={{ posts, addPost, updatePost, deletePost }}>
      {children}
    </PostsContext.Provider>
  );
}

export const usePosts = () => useContext(PostsContext);