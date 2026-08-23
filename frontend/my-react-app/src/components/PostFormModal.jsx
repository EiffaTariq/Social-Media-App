import { useState } from "react";
import { uploadFile } from "../api";


export default function PostFormModal({ initialData, onSubmit, onClose, statusOnly, submitting }) {
  const [caption, setCaption] = useState(initialData?.caption || "");
  const [preview, setPreview] = useState(initialData?.preview || null); // local preview (blob or existing url)
  const [imageUrl, setImageUrl] = useState(initialData?.preview || null); // Cloudinary URL sent to backend
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileError, setFileError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    await onSubmit({ cap: caption, img: imageUrl });
    onClose();
  }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError("");

    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setFileError("Only JPEG, PNG, or WEBP images are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError("Image must be smaller than 5MB");
      return;
    }

    setPreview(URL.createObjectURL(file)); // instant local preview
    setUploading(true);
    setProgress(0);

    uploadFile(file, (pct) => setProgress(pct))
      .then((data) => {
        setImageUrl(data.url); // real Cloudinary URL, sent on submit
        setUploading(false);
      })
      .catch((err) => {
        setFileError(err.message || "Upload failed");
        setUploading(false);
      });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h3>{initialData ? "Update post" : statusOnly ? "Add status" : "Add post"}</h3>
        {!statusOnly && (
          <>
            {preview && <img src={preview} alt="" className="modal-preview" />}
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} />
            {uploading && (
              <div className="file-progress-bar">
                <div className="file-progress-fill" style={{ width: `${progress}%` }} />
                <span>{progress}%</span>
              </div>
            )}
            {fileError && <p className="error-text small">{fileError}</p>}
          </>
        )}

        <textarea placeholder="Write a caption..." value={caption} onChange={(e) => setCaption(e.target.value)} />
        <div className="modal-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" disabled={submitting || uploading}>
            {submitting ? "Posting..." : uploading ? "Uploading..." : (initialData ? "Save changes" : "Post")}
          </button>
        </div>
      </form>
    </div>
  );
}