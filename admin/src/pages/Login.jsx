import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

// Decorative demo content only: no projects are fetched before login.
const previewProjects = [
  {
    name: "Website redesign",
    description: "Plan the layout and user experience",
  },
  {
    name: "Team workspace",
    description: "Organize tasks and project milestones",
  },
  { name: "Product launch", description: "Prepare the next release" },
];

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:5001/api/auth/login",
        { email, password },
      );
      localStorage.setItem("token", response.data.token);
      navigate("/projects");
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        setError("Incorrect email or password. Please try again.");
      } else {
        setError(
          err.response?.data?.message || "Login failed. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-preview" aria-hidden="true">
        <div className="login-preview-nav">
          <span className="login-preview-brand">TaskFlow Admin</span>
          <div className="login-preview-links">
            <span>Projects</span>
            <span>Logout</span>
          </div>
        </div>
        <div className="login-preview-content">
          <div className="login-preview-heading">
            <h2>Projects Management</h2>
            <span className="login-preview-new">+ New Project</span>
          </div>
          <div className="login-preview-table">
            <div className="login-preview-row login-preview-columns">
              <span>Project name</span>
              <span>Description</span>
              <span>Actions</span>
            </div>
            {previewProjects.map((project) => (
              <div className="login-preview-row" key={project.name}>
                <span>{project.name}</span>
                <span>{project.description}</span>
                <div className="login-preview-actions">
                  <span className="login-preview-tasks">Tasks →</span>
                  <span className="login-preview-edit">Edit</span>
                  <span className="login-preview-delete">Delete</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="login-overlay" aria-hidden="true" />

      <form
        className="login-form"
        onSubmit={handleSubmit}
        aria-labelledby="login-title"
        aria-busy={loading}
      >
        <div className="login-heading">
          <h2 id="login-title">TaskFlow</h2>
          <p>Sign in to manage your projects.</p>
        </div>
        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}

        <div className="login-input-group">
          <label htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@taskflow.com"
            required
          />
        </div>
        <div className="login-input-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
