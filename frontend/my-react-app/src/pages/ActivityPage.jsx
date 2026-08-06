import { useState } from "react";
import { activity, avatar } from "../data.js";

const TABS = [
  ["all", "All"],
  ["like", "Likes"],
  ["comment", "Comments"],
  ["follow", "New follows"],
];

export default function ActivityPage() {
  const [tab, setTab] = useState("all");
  const filtered = activity.filter((a) => (tab === "all" ? true : a.type === tab));

  return (
    <div>
      <div className="page-head">
        <span className="eyebrow">Activity</span>
        <h1>What people are saying</h1>
      </div>
      <div className="tabrow">
        {TABS.map(([k, l]) => (
          <button key={k} className={"tab" + (tab === k ? " active" : "")} onClick={() => setTab(k)}>
            {l}
          </button>
        ))}
      </div>
      <div>
        {filtered.map((a) => (
          <div className="act-row" key={a.id}>
            <img className="avatar" src={avatar(a.av)} width="46" height="46" alt="" />
            <div className="txt">
              <b>{a.name}</b> {a.txt} <span className="time">· {a.time}</span>
            </div>
            {a.thumb ? <img className="thumb" src={a.thumb} alt="" /> : <span className="follow-cta">Follow back</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
