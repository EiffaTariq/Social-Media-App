const BASE_URL = "http://localhost:7000/api";


export async function getAllUsers() {
  const res = await fetch(`${BASE_URL}/user/all`);
  if (!res.ok) throw new Error("Failed to load users");
  const data = await res.json();
  return data.users;
}
export async function getAllPosts() {
  const res = await fetch(`${BASE_URL}/post/all`);
  if (!res.ok) throw new Error("Failed to load posts");
  const data = await res.json();
  return data.posts;
}

export async function createPost(caption, ownerId, image) {
  const res = await fetch(`${BASE_URL}/post/new`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ caption, ownerId, image }),
  });
  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
}

export async function likePost(postId, userId) {
  const res = await fetch(`${BASE_URL}/post/${postId}/like`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error("Failed to like post");
  return res.json();
}

export async function updatePostCaption(postId, caption) {
  const res = await fetch(`${BASE_URL}/post/${postId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ caption }),
  });
  if (!res.ok) throw new Error("Failed to update post");
  return res.json();
}

export async function deletePostById(postId) {
  const res = await fetch(`${BASE_URL}/post/${postId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete post");
  return res.json();
}

export async function addComment(postId, userId, comment) {
  const res = await fetch(`${BASE_URL}/post/${postId}/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, comment }),
  });
  if (!res.ok) throw new Error("Failed to add comment");
  return res.json();
}

export async function createStatus(caption, ownerId, image) {
  const res = await fetch(`${BASE_URL}/status/new`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ caption, ownerId, image }),
  });
  if (!res.ok) throw new Error("Failed to create status");
  return res.json();
}

export async function getAllStatuses() {
  const res = await fetch(`${BASE_URL}/status/all`);
  if (!res.ok) throw new Error("Failed to load statuses");
  const data = await res.json();
  return data.statuses;
}

export async function markStatusSeen(statusId, userId) {
  const res = await fetch(`${BASE_URL}/status/${statusId}/seen`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error("Failed to mark status seen");
  return res.json();
}