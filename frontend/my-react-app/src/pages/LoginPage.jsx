import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage({ onSwitchToSignup }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "Password must be at least 6 characters";
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
      await login(form.email, form.password);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {serverError && <p className="auth-error">{serverError}</p>}

        <div className="field">
        <span className="field-label">Email</span>
        <div className="field-row">
          <Icon.Mail width={16} height={16} />
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        {errors.email && <span className="auth-error">{errors.email}</span>}
      </div>

        {/* <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {errors.email && <span className="auth-error">{errors.email}</span>} */}

        {/* <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        /> */}
        
        {/* {errors.password && <span className="auth-error">{errors.password}</span>} */}
        <div className="field">
        <span className="field-label">Password</span>
          <div className="field-row">
            <Icon.Lock width={16} height={16} />
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button type="button" className="field-forgot">Forgot?</button>
          </div>
          {errors.password && <span className="auth-error">{errors.password}</span>}
        </div>

        {/* <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p>
          No account?{" "}
          <button type="button" className="link-btn" onClick={onSwitchToSignup}>
            Sign up
          </button>
        </p> */}
        <div className="auth-bottom-row">
          <span>
    No account?{" "}
    <button type="button" className="link-btn" onClick={onSwitchToSignup}>
      Signup
    </button>
          </span>
          <button type="submit" disabled={loading}>
            {loading ? "..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}