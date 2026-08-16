// {Object.values(groupedByOwner).map((userStatuses) => {
//   const allSeen = userStatuses.every((s) => s.seenBy.includes(CURRENT_USER_ID));
//   return (
//     <div key={userStatuses[0].owner._id} className={allSeen ? "status-ring-seen" : "status-ring-unseen"}>
//       <img src={userStatuses[0].owner.profilePic?.url} onClick={() => openStatusViewer(userStatuses)} />
//     </div>
//   );
// })}

// frontend/my-react-app/src/components/StatusRail.jsx
import { useStatuses } from "../context/StatusContext.jsx";
import { CURRENT_USER_ID } from "../currentUser.js";

export default function StatusRail({ onOpenStatusGroup }) {
  const { statuses, loading } = useStatuses();

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
        const allSeen = group.every((s) => s.seenBy?.includes(CURRENT_USER_ID));
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