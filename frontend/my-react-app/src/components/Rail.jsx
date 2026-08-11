import Brand from "./Brand.jsx";
import Icon from "../icons/Icon.jsx";
import { NAV } from "../nav.js";
import StatusRail from "./StatusRail.jsx";

export default function Rail({ active, setActive, onOpenStatusGroup }) {
  return (
    <aside className="rail">
      <Brand />
      <StatusRail onOpenStatusGroup={onOpenStatusGroup} />
      <nav>
        {NAV.map((n) => (
          <a
            key={n.key}
            href="#"
            className={"navitem" + (active === n.key ? " active" : "")}
            onClick={(e) => {
              e.preventDefault();
              setActive(n.key);
            }}
          >
            <n.icon />
            {n.label}
          </a>
        ))}
      </nav>
      {/* <button className="create">
        <Icon.Plus />
        New post
      </button> */}
      <div className="footer"></div>
    </aside>
  );
}
