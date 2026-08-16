import { useEffect, useRef, useState } from "react";
import Icon from "../icons/Icon.jsx";

export default function DotMenu({ options, className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`dot-menu ${className}`} ref={ref}>
      <button
        type="button"
        className="dot-menu-trigger"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-label="More options"
      >
        <Icon.Dots />
      </button>
      <div className={`dot-menu-panel ${open ? "open" : ""}`}>
        {options.map((opt, i) => (
          <button
            key={i}
            type="button"
            className={"dot-menu-item" + (opt.danger ? " danger" : "")}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
              opt.onClick();
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}