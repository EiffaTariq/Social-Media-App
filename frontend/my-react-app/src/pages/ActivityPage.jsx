import { useEffect, useState } from "react";
import { usePosts } from "../context/PostsContext.jsx";
import { getAllUsers } from "../api.js";
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
  const { posts } = usePosts();
  const { user } = useAuth();

  const userPicMap = Object.fromEntries(
  users.map((u) => [u._id, u.profilePic?.url])
  );
  const avatarFor = (userId) =>
  userPicMap[userId] || `https://api.dicebear.com/7.x/initials/svg?seed=${userId}`;

   useEffect(() => {
    getAllUsers().then(setUsers).catch(() => {});
  }, []);


  const userMap = Object.fromEntries(users.map((u) => [u._id, u.name]));

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

  const me = users.find((u) => u._id === user._id);
  const followActivity = (me?.followers || []).map((f) => ({
    id: `follow-${f._id || f}`,
    type: "follow",
    name: userMap[f._id || f] || "Someone",
    av: f._id || f,
    txt: "started following you",
  }));

  const activity = [...likeActivity, ...commentActivity, ...followActivity];
  const filtered = activity.filter((a) => (tab === "all" ? true : a.type === tab));


  return (
    <div>
      <div className="page-head">
        <span className="eyebrow">Activity</span>
        <h1>What people are saying</h1>
      </div>
      <div className="tabrow">
        {TABS.map(([k, l]) => (
          <button key={k} className={"tab" + (tab === k ? " active" : "")} onClick={() => setTab(k)}>
            {l}
          </button>
        ))}
      </div>
      <div>
        {filtered.map((a) => (
          <div className="act-row" key={a.id}>
            <img className="avatar" src={avatarFor(a.av)} width="46" height="46" alt="" />
            <div className="txt">
              <b>{a.name}</b> {a.txt} <span className="time">· {a.time}</span>
            </div>
            {a.thumb ? <img className="thumb" src={a.thumb} alt="" /> : <span className="follow-cta">Follow back</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
