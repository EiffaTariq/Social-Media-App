const BASE_URL = "http://localhost:7000/api";

export async function getAllUsers() {
  const res = await fetch(`${BASE_URL}/user/all`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load users");
  const data = await res.json();
  return data.users;
}

export async function getUserById(id) {
  const res = await fetch(`${BASE_URL}/user/${id}`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load user");
  return res.json();
}

export async function updateUserProfile(id, data) {
  const res = await fetch(`${BASE_URL}/user/${id}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to update profile");
  return result;
}

export async function searchUsers(query) {
  const res = await fetch(`${BASE_URL}/user/search?q=${encodeURIComponent(query)}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to search users");
  const data = await res.json();
  return data.users;
}

export async function toggleFollowUser(userId) {
  const res = await fetch(`${BASE_URL}/user/${userId}/follow`, {
    method: "POST",
    credentials: "include",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to follow/unfollow user");
  return data;
}

export async function getAllPosts() {
  const res = await fetch(`${BASE_URL}/post/all`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load posts");
  const data = await res.json();
  return data.posts;
}

export async function createPost(caption, ownerId, image) {
  const res = await fetch(`${BASE_URL}/post/new`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ caption, ownerId, image }),
  });
  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
}

export async function likePost(postId, userId) {
  const res = await fetch(`${BASE_URL}/post/${postId}/like`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error("Failed to like post");
  return res.json();
}

export async function updatePost(postId, data) {
  const res = await fetch(`${BASE_URL}/post/${postId}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) {
    const err = new Error(result.message || "Failed to update post");
    err.fieldErrors = result.errors || null;
    throw err;
  }
  return result;
}

export async function deletePostById(postId) {
  const res = await fetch(`${BASE_URL}/post/${postId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete post");
  return res.json();
}

export async function createStatus(caption, ownerId, image) {
  const res = await fetch(`${BASE_URL}/status/new`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ caption, ownerId, image }),
  });
  if (!res.ok) throw new Error("Failed to create status");
  return res.json();
}

export async function getAllStatuses() {
  const res = await fetch(`${BASE_URL}/status/all`, { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load statuses");
  const data = await res.json();
  return data.statuses;
}

export async function markStatusSeen(statusId, userId) {
  const res = await fetch(`${BASE_URL}/status/${statusId}/seen`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error("Failed to mark status seen");
  return res.json();
}

export async function addComment(postId, userId, comment) {
  const res = await fetch(`${BASE_URL}/post/${postId}/comment`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, comment }),
  });
  if (!res.ok) throw new Error("Failed to add comment");
  return res.json();
}

export async function editComment(postId, commentId, comment) {
  const res = await fetch(`${BASE_URL}/post/${postId}/comment/${commentId}`, {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ comment }),
  });
  if (!res.ok) throw new Error("Failed to update comment");
  return res.json();
}

export async function deleteComment(postId, commentId) {
  const res = await fetch(`${BASE_URL}/post/${postId}/comment/${commentId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete comment");
  return res.json();
}

export async function replyToComment(postId, commentId, userId, comment) {
  const res = await fetch(`${BASE_URL}/post/${postId}/comment/${commentId}/reply`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, comment }),
  });
  if (!res.ok) throw new Error("Failed to add reply");
  return res.json();
}


export function uploadFile(file, onProgress) {
  const formData = new FormData();
  formData.append("file", file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${BASE_URL}/upload`);
    xhr.withCredentials = true; // sends the auth cookie, same as credentials: "include"

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText || "{}");
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data);
      } else {
        reject(new Error(data.message || "Upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(formData);
  });
}