import { NAV } from "../nav.js";

export default function BottomNav({ active, setActive }) {
  return (
    <div className="bottomnav">
      {NAV.map((n) => (
        <button
          key={n.key}
          className={"navbtn" + (active === n.key ? " active" : "")}
          onClick={() => setActive(n.key)}
        >
          <n.icon />
          {n.label}
        </button>
      ))}
    </div>
  );
}
