import { useState } from "react";
import Icon from "../icons/Icon.jsx";
import { useStatuses } from "../context/StatusContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import PostFormModal from "../components/PostFormModal.jsx";
import { useUI } from "../context/UIContext.jsx";
import { AvatarSkeleton } from "../components/Skeleton.jsx";

function formatTime(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return sameDay ? `Today at ${time}` : `${d.toLocaleDateString()} at ${time}`;
}

export default function UpdatesPage() {
  const { statuses, loading, uploading, addStatus } = useStatuses();
  const { openStatusGroup } = useUI();
  const [showAddStatus, setShowAddStatus] = useState(false);
  const [addError, setAddError] = useState(null);
  const [viewedOpen, setViewedOpen] = useState(false);
  const { user } = useAuth();

  async function handleAddStatus({ cap, img }) {
    try {
      await addStatus(cap, user._id, img);
    } catch {
      setAddError("Couldn't post status. Try again.");
    }
  }

  if (loading) {
    return (
      <div className="updates-page">
        <div className="page-head"><h1>Status</h1></div>
        <div className="status-rail">
          {Array.from({ length: 5 }).map((_, i) => <AvatarSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  const grouped = {};
  statuses.forEach((s) => {
    const ownerId = s.owner?._id;
    if (!ownerId) return;
    if (!grouped[ownerId]) grouped[ownerId] = [];
    grouped[ownerId].push(s);
  });

  const myGroup = grouped[user._id] || [];
  const otherGroups = Object.values(grouped).filter(
    (g) => g[0].owner?._id !== user._id
  );

  const recent = [];
  const viewed = [];
  otherGroups.forEach((g) => {
    const sorted = [...g].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const allSeen = sorted.every((s) => s.seenBy?.includes(user._id));
    (allSeen ? viewed : recent).push(sorted);
  });

  return (
    <div className="updates-page">
      <div className="updates-header">
        <h1>Status</h1>
        <button className="icon-btn" onClick={() => setShowAddStatus(true)} aria-label="Add status">
          <Icon.Plus />
        </button>
      </div>

      <button
        className="updates-my-status"
        onClick={() => (myGroup.length ? openStatusGroup(myGroup) : setShowAddStatus(true))}
      >
        <div className={`updates-avatar-wrap ${myGroup.length ? "seen" : "empty"}`}>
          <img src={user.profilePic?.url || "/default-avatar.png"} alt="You" />
          {!myGroup.length && (
            <span
              className="updates-add-badge"
              onClick={(e) => { e.stopPropagation(); setShowAddStatus(true); }}
            >
              <Icon.Plus />
            </span>
          )}
        </div>
        <div className="updates-text">
          <span className="updates-name">My status</span>
          <span className="updates-sub">
            {myGroup.length ? formatTime(myGroup[0].createdAt) : "Click to add status update"}
          </span>
        </div>
      </button>

      {addError && <p className="error-text">{addError}</p>}

      {recent.length > 0 && (
        <>
          <div className="updates-section-label">Recent</div>
          {recent.map((group) => (
            <StatusRow key={group[0].owner._id} group={group} unseen onOpen={() => openStatusGroup(group)} />
          ))}
        </>
      )}

      {viewed.length > 0 && (
        <div className="updates-section">
          <div className="updates-section-label clickable" onClick={() => setViewedOpen((o) => !o)}>
            Viewed
            <span className="updates-toggle">{viewedOpen ? "Hide" : "Show"}</span>
          </div>
          {viewedOpen &&
            viewed.map((group) => (
              <StatusRow key={group[0].owner._id} group={group} unseen={false} onOpen={() => openStatusGroup(group)} />
            ))}
        </div>
      )}

      {recent.length === 0 && viewed.length === 0 && (
        <p className="updates-empty">No updates yet. Statuses from people you follow will show up here.</p>
      )}

      {showAddStatus && (
        <PostFormModal
          statusOnly
          onSubmit={handleAddStatus}
          onClose={() => setShowAddStatus(false)}
          submitting={uploading}
        />
      )}
    </div>
  );
}

function StatusRow({ group, unseen, onOpen }) {
  const owner = group[0].owner;
  return (
    <button className="updates-row" onClick={onOpen}>
      <div className={`updates-avatar-wrap ${unseen ? "unseen" : "seen"}`}>
        <img src={owner.profilePic?.url || "/default-avatar.png"} alt={owner.name} />
      </div>
      <div className="updates-text">
        <span className="updates-name">{owner.name}</span>
        <span className="updates-sub">{formatTime(group[0].createdAt)}</span>
      </div>
    </button>
  );
}