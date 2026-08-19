
import { User } from "../../../../backend/models/userModel.js";
import { useStatuses } from "../context/StatusContext.jsx";
//import { CURRENT_USER_ID } from "../currentUser.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function StatusRail({ onOpenStatusGroup }) {
  const { statuses, loading } = useStatuses();
  const { user } = useAuth();
  if (loading || statuses.length === 0) return null;

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
        const owner = group[0].owner;
        return (
          <button
            key={owner._id}
            className={`status-avatar ${allSeen ? "seen" : "unseen"}`}
            onClick={() => onOpenStatusGroup(group)}
          >
            <img src={owner.profilePic?.url || "/default-avatar.png"} alt={owner.name} />
          </button>
        );
      })}
    </div>
  );
}