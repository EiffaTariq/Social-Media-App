import { useState } from "react";

const VISIBILITY_OPTIONS = [
  { value: "public", label: "Public" },
  { value: "friends", label: "Friends only" },
  { value: "private", label: "Only me" },
];

function validate({ caption, visibility, location, eventDate, altText, hasImage }) {
  const errors = {};

  if (!caption.trim()) errors.caption = "Caption is required";
  else if (caption.trim().length < 3) errors.caption = "Caption must be at least 3 characters";
  else if (caption.trim().length > 500) errors.caption = "Caption cannot exceed 500 characters";

  if (!visibility) errors.visibility = "Select a visibility option";

  if (location.length > 100) errors.location = "Location cannot exceed 100 characters";

  if (eventDate) {
    const parsed = new Date(eventDate);
    if (isNaN(parsed.getTime())) errors.eventDate = "Enter a valid date";
    else if (parsed > new Date()) errors.eventDate = "Date cannot be in the future";
  }

  if (hasImage && !altText.trim()) errors.altText = "Alt text is required when an image is attached";
  else if (altText.length > 150) errors.altText = "Alt text cannot exceed 150 characters";

  return errors;
}

export default function EditPostForm({ post, onSubmit, onClose }) {
  const [caption, setCaption] = useState(post.caption || "");
  const [visibility, setVisibility] = useState(post.visibility || "public");
  const [location, setLocation] = useState(post.location || "");
  const [eventDate, setEventDate] = useState(
    post.eventDate ? post.eventDate.slice(0, 10) : ""
  );
  const [altText, setAltText] = useState(post.altText || "");
  const [image, setImage] = useState(null); // new base64 image, if changed
  const [preview, setPreview] = useState(post.image || null);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message }

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: "Only JPEG, PNG, or WEBP images are allowed" }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image must be smaller than 5MB" }));
      return;
    }
    setErrors((prev) => ({ ...prev, image: undefined }));

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const hasImage = Boolean(image || post.image);
    const fieldErrors = validate({ caption, visibility, location, eventDate, altText, hasImage });

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        caption: caption.trim(),
        visibility,
        location: location.trim(),
        eventDate: eventDate || null,
        altText: altText.trim(),
        image, // null if unchanged — backend keeps existing image
      });
      setToast({ type: "success", message: "Post updated successfully" });
      setTimeout(() => onClose(), 900);
    } catch (err) {
      if (err.fieldErrors) setErrors(err.fieldErrors);
      setToast({ type: "error", message: err.message || "Failed to update post" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <form className="modal-card" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h3>Edit post</h3>

        {toast && <div className={`toast toast-${toast.type}`}>{toast.message}</div>}

        <label className="field-label">Caption</label>
        <textarea value={caption} onChange={(e) => setCaption(e.target.value)} />
        {errors.caption && <p className="error-text small">{errors.caption}</p>}

        <label className="field-label">Visibility</label>
        <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
          {VISIBILITY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {errors.visibility && <p className="error-text small">{errors.visibility}</p>}

        <label className="field-label">Location</label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Optional" />
        {errors.location && <p className="error-text small">{errors.location}</p>}

        <label className="field-label">Date</label>
        <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
        {errors.eventDate && <p className="error-text small">{errors.eventDate}</p>}

        <label className="field-label">Photo</label>
        {preview && <img src={preview} alt="" className="modal-preview" />}
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} />
        {errors.image && <p className="error-text small">{errors.image}</p>}

        <label className="field-label">Alt text</label>
        <input type="text" value={altText} onChange={(e) => setAltText(e.target.value)} placeholder="Describe the image for accessibility" />
        {errors.altText && <p className="error-text small">{errors.altText}</p>}

        <div className="modal-actions">
          <button type="button" onClick={onClose} disabled={submitting}>Cancel</button>
          <button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}