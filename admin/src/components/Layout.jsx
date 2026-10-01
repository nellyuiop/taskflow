import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./Layout.css";

function Layout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-container">
      <a className="tf-skip-link" href="#taskflow-main">
        Skip to content
      </a>
      <header className="topbar">
        <div className="tf-topbar-inner">
          <NavLink
            to="/projects"
            className="tf-brand"
            aria-label="TaskFlow projects"
          >
            <span className="tf-brand-mark" aria-hidden="true">
              T
            </span>
            <span>
              TaskFlow <span className="tf-admin-label">Admin</span>
            </span>
          </NavLink>
          <nav className="topbar-nav" aria-label="Main navigation">
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Projects
            </NavLink>
            <button type="button" onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main id="taskflow-main" className="main-content" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
