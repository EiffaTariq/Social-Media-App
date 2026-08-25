import { useEffect, useState } from "react";
import { usePosts } from "../context/PostsContext.jsx";
import { ListRowSkeleton } from "../components/Skeleton.jsx";
import {
  getAllUsers,
  toggleFollowUser,
  acceptFollowRequest,
  rejectFollowRequest,
} from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

const TABS = [
  ["all", "All"],
  ["like", "Likes"],
  ["comment", "Comments"],
  ["follow", "New follows"],
];

export default function ActivityPage() {
  const [tab, setTab] = useState("all");
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [followBusy, setFollowBusy] = useState(false);
  const [actionError, setActionError] = useState("");

  const { posts } = usePosts();
  const { user, refreshUser } = useAuth();

  const [followingIds, setFollowingIds] = useState(
    (user.followings || []).map((f) => f._id || f)
  );

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch(() => {})
      .finally(() => setUsersLoading(false));
  }, []);

  async function refreshUsers() {
    try {
      const fresh = await getAllUsers();
      setUsers(fresh);
    } catch (err) {
      setActionError(err.message || "Couldn't refresh.");
    }
  }

  async function handleAcceptRequest(requesterId) {
    setFollowBusy(true);
    try {
      await acceptFollowRequest(requesterId);
      await refreshUsers();
      refreshUser?.();
    } catch (err) {
      setActionError(err.message || "Couldn't accept request.");
    } finally {
      setFollowBusy(false);
    }
  }

  async function handleRejectRequest(requesterId) {
    setFollowBusy(true);
    try {
      await rejectFollowRequest(requesterId);
      await refreshUsers();
      refreshUser?.();
    } catch (err) {
      setActionError(err.message || "Couldn't reject request.");
    } finally {
      setFollowBusy(false);
    }
  }

  async function handleFollowBack(uid) {
    setFollowBusy(true);
    try {
      const data = await toggleFollowUser(uid);
      setFollowingIds((prev) =>
        data.following || data.requested
          ? [...prev, uid]
          : prev.filter((id) => id !== uid)
      );
      await refreshUsers();
    } catch (err) {
      setActionError(err.message || "Couldn't update follow status.");
    } finally {
      setFollowBusy(false);
    }
  }

  const userMap = Object.fromEntries(users.map((u) => [u._id, u.name]));
  const userPicMap = Object.fromEntries(
    users.map((u) => [u._id, u.profilePic?.url])
  );
  const avatarFor = (userId) =>
    userPicMap[userId] ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${userId}`;

  const me = users.find((u) => u._id === user._id);

  const myPosts = posts.filter((p) => p.owner?._id === user._id);

  const likeActivity = myPosts.flatMap((p) =>
    (p.likes || [])
      .filter((uid) => uid !== user._id)
      .map((uid) => ({
        id: `like-${p._id}-${uid}`,
        type: "like",
        name: userMap[uid] || "Someone",
        av: uid,
        txt: "liked your post",
        thumb: p.image,
      }))
  );

  const commentActivity = myPosts.flatMap((p) =>
    (p.comments || []).map((c, i) => ({
      id: `comment-${p._id}-${i}`,
      type: "comment",
      name: c.user?.name || "Someone",
      av: c.user?._id,
      txt: `commented: "${c.comment}"`,
      thumb: p.image,
    }))
  );

  // People who have SENT you a follow request (pending)
  const followRequestActivity = (me?.followRequests || []).map((f) => ({
    id: `followreq-${f._id || f}`,
    type: "follow",
    status: "pending",
    name: userMap[f._id || f] || "Someone",
    av: f._id || f,
    txt: "wants to follow you",
  }));

  // People who are already following you (confirmed)
  const followActivity = (me?.followers || []).map((f) => ({
    id: `follow-${f._id || f}`,
    type: "follow",
    status: "accepted",
    name: userMap[f._id || f] || "Someone",
    av: f._id || f,
    txt: "started following you",
  }));

  const activity = [
    ...likeActivity,
    ...commentActivity,
    ...followRequestActivity,
    ...followActivity,
  ];

  const filtered = activity.filter((a) => (tab === "all" ? true : a.type === tab));

  return (
    <div>
      <div className="page-head">
        <span className="eyebrow">Activity</span>
        <h1>What people are saying</h1>
      </div>

      <div className="tabrow">
        {TABS.map(([k, l]) => (
          <button
            key={k}
            className={"tab" + (tab === k ? " active" : "")}
            onClick={() => setTab(k)}
          >
            {l}
          </button>
        ))}
      </div>

      {actionError && <p className="error-text small">{actionError}</p>}

      <div>
        {usersLoading && (
          <div>
            {Array.from({ length: 5 }).map((_, i) => (
              <ListRowSkeleton key={i} />
            ))}
          </div>
        )}

        {!usersLoading && filtered.length === 0 && (
          <p className="updates-empty">
            Nothing here yet.{" "}
            {tab === "all"
              ? "Activity from likes, comments, and follows will show up here."
              : `No ${tab} activity yet.`}
          </p>
        )}

        {!usersLoading && filtered.length > 0 && (
          <div>
            {filtered.map((a) => (
              <div className="act-row" key={a.id}>
                <img
                  className="avatar"
                  src={avatarFor(a.av)}
                  width="46"
                  height="46"
                  alt=""
                />
                <div className="txt">
                  <b>{a.name}</b> {a.txt}{" "}
                  {a.time && <span className="time">· {a.time}</span>}
                </div>

                {a.thumb && <img className="thumb" src={a.thumb} alt="" />}

                {a.type === "follow" && a.status === "pending" && (
                  <div className="follow-req-actions">
                    <button
                      className="follow-cta"
                      disabled={followBusy}
                      onClick={() => handleAcceptRequest(a.av)}
                    >
                      Accept
                    </button>
                    <button
                      className="follow-cta reject"
                      disabled={followBusy}
                      onClick={() => handleRejectRequest(a.av)}
                    >
                      Reject
                    </button>
                  </div>
                )}

                {a.type === "follow" && a.status === "accepted" && (
                  <button
                    className="follow-cta"
                    disabled={followBusy || followingIds.includes(a.av)}
                    onClick={() => handleFollowBack(a.av)}
                  >
                    {followingIds.includes(a.av) ? "Following" : "Follow back"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}