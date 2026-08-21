import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function SignupPage({ onSwitchToLogin }) {
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    gender: "",
    bio: "",
  });
  const [preview, setPreview] = useState(null); // profile picture (base64)
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";

    if (!form.username.trim()) errs.username = "Username is required";
    else if (!/^[a-zA-Z0-9_.]{3,24}$/.test(form.username))
      errs.username = "3-24 characters, letters/numbers/underscore/dot only";

    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[A-Za-z0-9._%+-]+@gmail\.com$/.test(form.email)) errs.email = "Enter a valid email";

    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters";
    else if (!/\d/.test(form.password)) errs.password = "Password must include a number";

    if (!form.gender) errs.gender = "Select a gender";

    return errs;
  };

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setServerError("");
    setSuccessMsg("");
    setLoading(true);
    try {
      await signup(
        form.name,
        form.username,
        form.email,
        form.password,
        form.gender,
        form.bio,
        preview ? { url: preview } : undefined
      );
      setSuccessMsg("Account created! Redirecting you to login…");
      // Give the person a moment to see the confirmation, then send them to login.
      setTimeout(() => onSwitchToLogin(), 1200);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        {serverError && <p className="auth-error">{serverError}</p>}
        {successMsg && <p className="auth-success">{successMsg}</p>}

        <div className="avatar-upload">
          {preview ? (
            <img src={preview} alt="Profile preview" className="avatar-preview" />
          ) : (
            <div className="avatar-preview avatar-placeholder">Add photo</div>
          )}
          <input type="file" accept="image/*" onChange={handleFile} />
        </div>

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        {errors.name && <span className="auth-error">{errors.name}</span>}

        <input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value.trim() })}
        />
        {errors.username && <span className="auth-error">{errors.username}</span>}

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {errors.email && <span className="auth-error">{errors.email}</span>}

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {errors.password && <span className="auth-error">{errors.password}</span>}

        <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        {errors.gender && <span className="auth-error">{errors.gender}</span>}

        <textarea
          placeholder="Bio / caption (optional)"
          value={form.bio}
          maxLength={160}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>
        <p>
          Have an account?{" "}
          <button type="button" className="link-btn" onClick={onSwitchToLogin}>
            Login
          </button>
        </p>
      </form>
    </div>
  );
}
