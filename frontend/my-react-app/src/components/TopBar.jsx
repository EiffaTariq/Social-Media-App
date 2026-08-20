import { useEffect, useRef, useState } from "react";
import Icon from "../icons/Icon.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { searchUsers } from "../api.js";

export default function TopBar({ onOpenProfile }) {
  const { logout } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      return;
    }
    setSearching(true);
    const timer = setTimeout(() => {
      searchUsers(q)
        .then((users) => {
          setResults(users);
          setOpen(true);
        })
        .catch(() => setResults([]))
        .finally(() => setSearching(false));
    }, 300); // debounce

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(user) {
    setOpen(false);
    setQuery("");
    onOpenProfile?.(user._id);
  }

  return (
    <div className="topbar">
      <div className="searchwrap" ref={boxRef} style={{ position: "relative" }}>
        <Icon.Search style={{ width: 16, height: 16, color: "var(--text-mute)" }} />
        <input
          placeholder="Search people by username…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setOpen(true)}
        />
        {open && query.trim() && (
          <div className="search-dropdown">
            {searching && <div className="search-dropdown-item muted">Searching…</div>}
            {!searching && results.length === 0 && (
              <div className="search-dropdown-item muted">No users found</div>
            )}
            {!searching &&
              results.map((u) => (
                <div key={u._id} className="search-dropdown-item" onClick={() => handleSelect(u)}>
                  <img
                    src={u.profilePic?.url || `https://api.dicebear.com/7.x/initials/svg?seed=${u.username}`}
                    alt={u.name}
                  />
                  <div>
                    <div className="search-dropdown-name">{u.name}</div>
                    <div className="search-dropdown-username">@{u.username}</div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
      <button className="icon-btn" onClick={logout} title="Logout">
        <Icon.Bell style={{ width: 17, height: 17 }} />
      </button>
    </div>
  );
}
