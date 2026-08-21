import { usePosts } from "../context/PostsContext";

export default function PostUpdateLoader() {
  const { updatingPost } = usePosts();

  if (!updatingPost) return null;

  return (
    <div className="post-update-loader">
      <div className="post-update-spinner"></div>
      <span>Saving changes to post...</span>
    </div>
  );
}