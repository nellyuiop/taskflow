import { useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitting = useRef(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting.current) return;

    setError("");

    const apiUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

    if (!apiUrl) {
      setError("The login service is not configured. Please contact support.");
      return;
    }

    submitting.current = true;
    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/api/auth/login`, {
        email: email.trim(),
        password,
      });

      const token = response.data?.token;

      if (typeof token !== "string" || !token) {
        setError("Unable to complete sign-in. Please try again.");
        return;
      }

      localStorage.setItem("token", token);
      navigate("/projects", { replace: true });
    } catch (err) {
      const status = err.response?.status;

      if (status === 401) {
        localStorage.removeItem("token");
        setError("Incorrect email or password. Please try again.");
      } else if (status === 429) {
        setError("Too many login attempts. Please wait and try again.");
      } else if (!err.response) {
        setError(
          "Unable to reach the login service. Check your connection and try again.",
        );
      } else {
        setError("Unable to sign in right now. Please try again.");
      }
    } finally {
      submitting.current = false;
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="fake-dashboard" aria-hidden="true">
        <div className="fake-topbar">
          <span>TaskFlow Admin</span>
        </div>

        <div className="fake-content">
          {[1, 2, 3].map((item) => (
            <div className="fake-card" key={item}>
              <div className="fake-card-heading" />
              <div className="fake-card-line" />
              <div className="fake-card-line short" />
            </div>
          ))}
        </div>
      </div>

      <div className="blur-overlay" aria-hidden="true" />

      <main className="login-form-container">
        <form
          onSubmit={handleSubmit}
          className="glass-form"
          aria-labelledby="login-title"
          aria-busy={loading}
        >
          <div className="login-heading">
            <span className="login-eyebrow">YOUR WORKSPACE</span>
            <h1 id="login-title">TaskFlow Admin</h1>
            <p>Welcome back. Sign in to continue.</p>
          </div>

          {error && (
            <p id="login-error" className="error-text" role="alert">
              {error}
            </p>
          )}

          <div className="login-field">
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@taskflow.com"
              aria-describedby={error ? "login-error" : undefined}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              aria-describedby={error ? "login-error" : undefined}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default Login;
