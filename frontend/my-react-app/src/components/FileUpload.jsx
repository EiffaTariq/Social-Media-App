import { useRef, useState } from "react";
import { uploadFile } from "../api";

const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export default function FileUpload({ onUploaded, initialPreview }) {
  const [preview, setPreview] = useState(initialPreview || null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  function validateFile(file) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Only JPEG, PNG, or WEBP images are allowed";
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File must be smaller than ${MAX_SIZE_MB}MB`;
    }
    return null;
  }

  function handleFile(file) {
    if (!file) return;
    setError("");
    setUploadedUrl(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setPreview(URL.createObjectURL(file));
    startUpload(file);
  }

  function startUpload(file) {
    setUploading(true);
    setProgress(0);

    uploadFile(file, (pct) => setProgress(pct))
      .then((data) => {
        setUploadedUrl(data.url);
        setUploading(false);
        onUploaded?.(data.url, data.publicId);
      })
      .catch((err) => {
        setError(err.message || "Upload failed");
        setUploading(false);
      });
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  }

  return (
    <div className="file-upload">
      <div
        className={`file-drop-zone${dragActive ? " active" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="file-preview-img" />
        ) : (
          <p>Drag & drop an image here, or click to choose one</p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          hidden
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {uploading && (
        <div className="file-progress-bar">
          <div className="file-progress-fill" style={{ width: `${progress}%` }} />
          <span>{progress}%</span>
        </div>
      )}

      {error && <p className="file-error">{error}</p>}

      {uploadedUrl && !uploading && (
        <p className="file-success">
          Uploaded — <a href={uploadedUrl} target="_blank" rel="noreferrer">view file</a>
        </p>
      )}
    </div>
  );
}