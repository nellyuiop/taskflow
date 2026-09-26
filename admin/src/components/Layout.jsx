import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./Layout.css";

function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Delete the token
    navigate("/login"); // Send them back to login
  };

  return (
    <div className="layout-container">
      <div className="sidebar">
        <h2>TaskFlow Admin</h2>
        <nav
          style={{
            marginTop: "30px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/projects"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Projects
          </NavLink>

          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Tasks
          </NavLink>

          {/* LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            style={{
              marginTop: "20px",
              padding: "10px",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Logout
          </button>
        </nav>
      </div>

      <div className="main-area">
        <div className="topbar">
          <strong>Admin Panel</strong>
        </div>

        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
