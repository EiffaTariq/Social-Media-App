import { useState } from "react";

export default function PostFormModal({ initialData, onSubmit, onClose, statusOnly, submitting }) {
  const [caption, setCaption] = useState(initialData?.caption || "");
  const [preview, setPreview] = useState(initialData?.preview || null); //changd 4m img 2 preview
 

  async function handleSubmit(e) {
    e.preventDefault();
    await onSubmit({ cap: caption, img: preview });
    onClose();
  }

  function handleFile(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => setPreview(reader.result);
  reader.readAsDataURL(file);
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
          <button type="submit" disabled={submitting}>
           {submitting ? "Posting..." : (initialData ? "Save changes" : "Post")}
          </button>
        </div>
        
      </form>
    </div>
  );
}
// !!statusOnly && blck