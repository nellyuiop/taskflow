import { useState } from "react";
import axios from "axios"; // 1. Import Axios
import { useNavigate } from "react-router-dom"; // 2. Import useNavigate
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // 3. State for error messages
  const [loading, setLoading] = useState(false); // 4. State for loading spinner

  const navigate = useNavigate(); // 5. Hook to change pages

  const handleSubmit = async (e) => {
    e.preventDefault(); // 6. Stop the page from refreshing on submit
    setLoading(true);
    setError("");

    try {
      // 7. Send POST request to your Week 1 Backend!
      const response = await axios.post(
        "http://127.0.0.1:5001/api/auth/login",
        {
          email,
          password,
        },
      );

      // 8. Save the JWT token to the browser's local storage
      localStorage.setItem("token", response.data.token);

      // 9. Redirect the user to the Dashboard
      navigate("/");
    } catch (err) {
      // 10. If login fails, show the error message from the backend
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>TaskFlow Admin Login</h2>

        {/* Show error message if there is one */}
        {error && (
          <p
            style={{ color: "red", textAlign: "center", marginBottom: "15px" }}
          >
            {error}
          </p>
        )}

        <div className="input-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@taskflow.com"
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
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
