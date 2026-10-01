import { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    completedTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [projectsRes, tasksRes] = await Promise.all([
          axios.get("http://127.0.0.1:5001/api/projects", config),
          axios.get("http://127.0.0.1:5001/api/tasks", config),
        ]);

        const completed = tasksRes.data.filter(
          (t) => t.status === "Done",
        ).length;

        setStats({
          projects: projectsRes.data.length,
          tasks: tasksRes.data.length,
          completedTasks: completed,
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching stats");
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h2 style={{ marginBottom: "30px", color: "#111827" }}>
        Dashboard Overview
      </h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Projects</h3>
          <p className="stat-number">{stats.projects}</p>
        </div>

        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p className="stat-number">{stats.tasks}</p>
        </div>

        <div className="stat-card">
          <h3>Completed Tasks</h3>
          <p className="stat-number" style={{ color: "#10b981" }}>
            {stats.completedTasks}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
