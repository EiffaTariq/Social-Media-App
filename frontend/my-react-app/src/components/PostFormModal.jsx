import { useState } from "react";

export default function PostFormModal({ initialData, onSubmit, onClose, statusOnly }) {
  const [caption, setCaption] = useState(initialData?.cap || "");
  const [preview, setPreview] = useState(initialData?.img || null);

  function handleFile(e) {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ cap: caption, img: preview });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h3>{initialData ? "Update post" : statusOnly ? "Add status" : "Add post"}</h3>
        {!statusOnly && (
          <>
            {preview && <img src={preview} alt="" className="modal-preview" />}
            <input type="file" accept="image/*" onChange={handleFile} />
          </>
        )}
        <textarea placeholder="Write a caption..." value={caption} onChange={(e) => setCaption(e.target.value)} />
        <div className="modal-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit">{initialData ? "Save changes" : "Post"}</button>
        </div>
      </form>
    </div>
  );
}