import { Link, Outlet } from "react-router-dom";
import "./Layout.css"; // Import the CSS file

function Layout() {
  return (
    <div className="layout-container">
      <div className="sidebar">
        <h2>TaskFlow Admin</h2>
        <nav style={{ marginTop: "30px" }}>
          <Link to="/">Dashboard</Link>
          <Link to="/projects"> Projects</Link>
          <Link to="/tasks">Tasks</Link>
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
