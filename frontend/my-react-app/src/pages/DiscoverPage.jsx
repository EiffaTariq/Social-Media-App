import { useState } from "react";
import Icon from "../icons/Icon.jsx";
import { usePosts } from "../context/PostsContext.jsx";
import { CURRENT_USER_ID } from "../currentUser.js";

// export default function DiscoverPage() {
//   return (
//     <div className="reel-feed">
//       {candidates.map((c) => <Reel key={c.id} item={c} />)}
//     </div>
//   );
// }

export default function DiscoverPage() {
  const { posts } = usePosts();
  return (
    <div className="reel-feed">
      {posts.map((p) => <Reel key={p._id} item={p} />)}
    </div>
  );
}

// function Reel({ item }) {
//   const [liked, setLiked] = useState(false);

  function Reel({ item }) {
  const { toggleLike } = usePosts();
  const liked = item.likes?.includes(CURRENT_USER_ID);

  async function handleLike() {
    try {
      await toggleLike(item._id, CURRENT_USER_ID);
    } catch (err) {
      console.error("Like failed", err);
    }
  }

   return (
    <section className="reel">
      <img src={item.image} alt={item.caption} className="reel-img" />
      <div className="reel-overlay">
        <h3>{item.owner?.name}</h3>
        <p>{item.caption}</p>
      </div>
      <div className="reel-actions">
        <button className="tooltip" data-tip="Like" onClick={handleLike}>
          <Icon.Heart style={{ fill: liked ? "currentColor" : "none" }} />
          <span>{item.likes?.length || 0}</span>
        </button>
        <button className="tooltip" data-tip="Comment"><Icon.Chat /><span>{item.comments?.length || 0}</span></button>
        <button className="tooltip" data-tip="Share to chat"><Icon.Send /></button>
      </div>
    </section>
  );
}

//   return (
//     <section className="reel">
//       <img src={item.img} alt={item.name} className="reel-img" />
//       <div className="reel-overlay">
//         <h3>{item.name}</h3>
//         <p>{item.bio}</p>
//       </div>
//       <div className="reel-actions">
//         <button className="tooltip" data-tip="Like" onClick={() => setLiked(!liked)}>
//           <Icon.Heart style={{ fill: liked ? "currentColor" : "none" }} />
//         </button>
//         <button className="tooltip" data-tip="Comment"><Icon.Chat /></button>
//         <button className="tooltip" data-tip="Share to chat"><Icon.Send /></button>
//       </div>
//     </section>
//   );
// }