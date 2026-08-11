// import { useState } from "react";
// import Icon from "../icons/Icon.jsx";
// import { avatar, CURRENT_USER, CURRENT_USER_AVATAR } from "../data.js";

// export default function PostCard({ p, onClick }) {
//   const [liked, setLiked] = useState(false);
//   const avatarSrc = p.owner === CURRENT_USER ? CURRENT_USER_AVATAR : avatar(p.av);
//   return (
//     <article className="post" onClick={onClick}>
//       <img src={p.img} alt={p.cap} loading="lazy" />
//       <div className="body">
//         <p className="cap">{p.cap}</p>
//         <div className="meta">
//           <div className="authorline">
//             <img className="avatar" src={avatar(p.av)} width="26" height="26" alt="" />
//             <span>{p.user}</span>
//           </div>
//           <div className="post-actions">
//               <button className={liked ? "liked" : ""} onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}>
//               <Icon.Heart style={{ fill: liked ? "currentColor" : "none" }} />
//               {p.likes + (liked ? 1 : 0)}
//             </button>
//             <button>
//               <Icon.Bookmark />
//             </button>
//           </div>
//         </div>
//       </div>
//     </article>
//   );
// }


import Icon from "../icons/Icon.jsx";
import { usePosts } from "../context/PostsContext.jsx";
import { CURRENT_USER_ID } from "../currentUser.js";

export default function PostCard({ p, onClick }) {
  const { toggleLike } = usePosts();
  const liked = p.likes?.includes(CURRENT_USER_ID);

  async function handleLike(e) {
    e.stopPropagation();
    try {
      await toggleLike(p._id, CURRENT_USER_ID);
    } catch (err) {
      console.error("Like failed", err);
    }
  }

  return (
    <article className="post" onClick={onClick}>
      <img src={p.image} alt={p.caption} loading="lazy" />
      <div className="body">
        <p className="cap">{p.caption}</p>
        <div className="meta">
          <div className="authorline">
            <span>{p.owner?.name}</span>
          </div>
          <div className="post-actions">
            <button className={liked ? "liked" : ""} onClick={handleLike}>
              <Icon.Heart style={{ fill: liked ? "currentColor" : "none" }} />
              {p.likes?.length || 0}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}