import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./Layout.css";

// Small outline icons; no additional package required.
function Icon({ name, size = 18 }) {
  const paths = {
    folder:
      "M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z",
    tasks: "m3 6 2 2 4-4M12 6h9M3 13l2 2 4-4M12 13h9M12 20h9",
    progress: "M4 19V5M4 19h16M8 15l4-4 4 2 5-8M17 5h4v4",
    plus: "M12 5v14M5 12h14",
    edit: "m15 5 4 4M4 20l4-1L20 7a2.8 2.8 0 0 0-4-4L4 15v5Z",
    trash: "M3 6h18M9 6V4h6v2M5 6l1 14h12l1-14M10 10v6M14 10v6",
    arrow: "M5 12h14m-5-5 5 5-5 5",
    close: "m6 6 12 12M6 18 18 6",
    logout: "M9 4H4v16h5M9 12h12m-5-5 5 5-5 5",
    shield: "M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3Zm-4 9 3 3 5-6",
  };
  return (
    <svg
      className="tf-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name]} />
    </svg>
  );
}

function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="app-container">
      <header className="topbar">
        {/* Left Side: Brand Logo & Main Nav */}
        <div className="topbar-left">
          {/* Clicking the brand takes you to the public site */}
          <a
            href="https://taskflowfrontend-three.vercel.app"
            className="brand-logo"
            title="Go to Public Site"
          >
            TaskFlow
          </a>

          <nav className="main-nav" aria-label="Admin navigation">
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              <Icon name="folder" /> Projects
            </NavLink>
          </nav>
        </div>

        {/* Right Side: Admin Badge & Logout */}
        <div className="topbar-right">
          {/* Just a visual tag to remind them they are in the admin panel */}
          <span className="admin-badge">
            <Icon name="shield" size={14} /> Admin Area
          </span>

          <button type="button" onClick={handleLogout} className="logout-btn">
            <Icon name="logout" size={16} /> Logout
          </button>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
