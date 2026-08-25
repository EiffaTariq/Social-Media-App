import { useEffect, useState } from "react";
import { useStatuses } from "../context/StatusContext.jsx";
//import { CURRENT_USER_ID } from "../currentUser.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function StatusViewer({ group, onClose }) {
  const { seeStatus } = useStatuses();
  const { user } = useAuth();
  const [index, setIndex] = useState(0);
  const current = group[index];

  useEffect(() => {
    if (!current) return;
    if (!current.seenBy?.includes(user._id)) {
      seeStatus(current._id, user._id).catch(() => {});
    }
  }, [current]);

  function goNext() {
    if (index < group.length - 1) setIndex(index + 1);
    else onClose();
  }

  function goPrev() {
    if (index > 0) setIndex(index - 1);
  }

  if (!current) return null;

  return (
    <div className="status-viewer-overlay" onClick={onClose}>
      <div className="status-viewer-card" onClick={(e) => e.stopPropagation()}>
        <div className="status-viewer-progress">
          {group.map((_, i) => (
            <div key={i} className={`bar ${i <= index ? "filled" : ""}`} />
          ))}
        </div>

        <div className="status-viewer-header">
          <img src={current.owner?.profilePic?.url || "/default-avatar.png"} alt="" />
          <span>{current.owner?.name}</span>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {current.image && <img src={current.image} alt="" className="status-viewer-img" />}
        {current.caption && <p className="status-viewer-caption">{current.caption}</p>}

        <div className="status-viewer-nav">
          <button onClick={goPrev} disabled={index === 0}>&larr;</button>
          <button onClick={goNext}>{index < group.length - 1 ? "→" : "Close"}</button>
        </div>
      </div>
    </div>
  );
}