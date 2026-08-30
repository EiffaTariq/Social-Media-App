import { createContext, useContext, useEffect, useState } from "react";

const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, { credentials: "include" });
      if (!res.ok) throw new Error("Not logged in");
      const data = await res.json();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    setUser(data.user);
    return data.user;
  };

  // NOTE: signup intentionally does NOT log the user in / does NOT set `user`.
  // The backend no longer issues a token on registration, so the person is
  // sent back to the login form to sign in with their new credentials.
  const signup = async (name, username, email, password, gender, bio, profilePic) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, username, email, password, gender, bio, profilePic }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Signup failed");
    return data.user;
  };

  const logout = async () => {
    await fetch(`${BASE_URL}/auth/logout`, { method: "GET", credentials: "include" });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser: fetchMe, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);