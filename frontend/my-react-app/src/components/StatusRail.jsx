import { useStatuses } from "../context/StatusContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import { AvatarSkeleton } from "../components/Skeleton.jsx";

export default function StatusRail() {
  const { statuses, loading } = useStatuses();
  const { user } = useAuth();
  const { openStatusGroup } = useUI();

  if (loading) {
    return (
      <div className="status-rail">
        {Array.from({ length: 5 }).map((_, i) => <AvatarSkeleton key={i} />)}
      </div>
    );
  }
  if (statuses.length === 0) return null; // intentional: no rail shown when there's truly nothing

  const grouped = {};
  statuses.forEach((s) => {
    const ownerId = s.owner?._id;
    if (!ownerId) return;
    if (!grouped[ownerId]) grouped[ownerId] = [];
    grouped[ownerId].push(s);
  });

  return (
    <div className="status-rail">
      {Object.values(grouped).map((group) => {
        const owner = group[0].owner;
        if (!owner) return null;
        const allSeen = group.every((s) => s.seenBy?.includes(user._id));
        return (
          <button
            key={owner._id}
            className={`status-avatar ${allSeen ? "seen" : "unseen"}`}
            onClick={() => openStatusGroup(group)}
          >
            <img src={owner.profilePic?.url || "/default-avatar.png"} alt={owner.name} />
          </button>
        );
      })}
    </div>
  );
}