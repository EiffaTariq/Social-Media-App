import { useState } from "react";
import Icon from "../icons/Icon.jsx";
import { candidates } from "../data.js";

export default function DiscoverPage() {
  return (
    <div className="reel-feed">
      {candidates.map((c) => <Reel key={c.id} item={c} />)}
    </div>
  );
}

function Reel({ item }) {
  const [liked, setLiked] = useState(false);
  return (
    <section className="reel">
      <img src={item.img} alt={item.name} className="reel-img" />
      <div className="reel-overlay">
        <h3>{item.name}</h3>
        <p>{item.bio}</p>
      </div>
      <div className="reel-actions">
        <button className="tooltip" data-tip="Like" onClick={() => setLiked(!liked)}>
          <Icon.Heart style={{ fill: liked ? "currentColor" : "none" }} />
        </button>
        <button className="tooltip" data-tip="Comment"><Icon.Chat /></button>
        <button className="tooltip" data-tip="Share to chat"><Icon.Send /></button>
      </div>
    </section>
  );
}