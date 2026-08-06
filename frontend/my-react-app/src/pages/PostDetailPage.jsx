import Icon from "../icons/Icon.jsx";
import { avatar } from "../data.js";

export default function PostDetailPage({ post, onBack }) {
  return (
    <div className="post-detail">
      <button className="back-btn" onClick={onBack}>&larr; Back</button>
      <img src={post.img} alt={post.cap} className="post-detail-img" />
      <div className="authorline">
        <img className="avatar" src={avatar(post.av)} width="30" height="30" alt="" />
        <span>{post.user}</span>
      </div>
      <p className="cap">{post.cap}</p>
      <div className="post-detail-icons">
        <button className="icon-btn tooltip" data-tip="Like"><Icon.Heart /></button>
        <button className="icon-btn tooltip" data-tip="Comment"><Icon.Chat /></button>
        <button className="icon-btn tooltip" data-tip="Share to chat"><Icon.Send /></button>
      </div>
    </div>
  );
}