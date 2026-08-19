import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function SignupPage({ onSwitchToLogin }) {
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", gender: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters";
    else if (!/\d/.test(form.password)) errs.password = "Password must include a number";
    if (!form.gender) errs.gender = "Select a gender";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setServerError("");
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password, form.gender);
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

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        {errors.name && <span className="auth-error">{errors.name}</span>}

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