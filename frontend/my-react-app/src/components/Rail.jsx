import Brand from "./Brand.jsx";
import Icon from "../icons/Icon.jsx";
import { NAV } from "../nav.js";

export default function Rail({ active, setActive }) {
  return (
    <aside className="rail">
      <Brand />
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
