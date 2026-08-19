import Icon from "../icons/Icon.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function TopBar() {
  const { logout } = useAuth();

  return (
    <div className="topbar">
      <div className="searchwrap">
        <Icon.Search style={{ width: 16, height: 16, color: "var(--text-mute)" }} />
        <input placeholder="Search people, places, moments…" />
      </div>
      <button className="icon-btn" onClick={logout} title="Logout">
        <Icon.Bell style={{ width: 17, height: 17 }} />
      </button>
    </div>
  );
}