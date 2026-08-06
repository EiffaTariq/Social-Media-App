import { createContext, useContext, useState } from "react";
import { posts as initialPosts } from "../data.js";

const PostsContext = createContext(null);

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState(initialPosts);

  const addPost = (post) =>
    setPosts((prev) => [{ id: Date.now(), owner: "me", likes: 0, av: 37, ...post }, ...prev]);

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