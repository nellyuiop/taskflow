import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "./Tasks.css";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Todo");
  const [projectId, setProjectId] = useState("");
  const [formError, setFormError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [searchParams] = useSearchParams();
  const filterProjectId = searchParams.get("projectId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [tasksRes, projectsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/tasks`, config),
          axios.get(`${import.meta.env.VITE_API_URL}/api/projects`, config),
        ]);

        setTasks(tasksRes.data);
        setProjects(projectsRes.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingId) {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/tasks/${editingId}`,
          { title, description, status, projectId },
          config,
        );
        setTasks(tasks.map((t) => (t._id === editingId ? response.data : t)));
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/tasks`,
          { title, description, status, projectId },
          config,
        );
        setTasks([...tasks, response.data]);
      }
      closeForm();
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        setFormError(err.response?.data?.message || "Action failed.");
      }
    }
  };

  const handleEditClick = (task) => {
    setEditingId(task._id);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setProjectId(task.projectId);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      alert("Failed to delete task.");
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setTitle("");
    setDescription("");
    setStatus("Todo");
    setProjectId("");
    setFormError("");
  };

  const getProjectName = (id) => {
    const project = projects.find((p) => p._id === id);
    return project ? project.name : "Unknown Project";
  };

  if (loading) return <div className="spinner"></div>;
  if (error) return <div className="error-message">{error}</div>;

  const displayedTasks = filterProjectId
    ? tasks.filter((t) => t.projectId === filterProjectId)
    : tasks;

  const currentProjectName = filterProjectId
    ? projects.find((p) => p._id === filterProjectId)?.name
    : "All";

  return (
    <div>
      <div className="page-header">
        <h2>Tasks for: {currentProjectName || "Loading..."}</h2>
        <button
          className={showForm ? "btn-secondary" : "btn-primary"}
          onClick={() => (showForm ? closeForm() : setShowForm(true))}
        >
          {showForm ? "Cancel" : "+ New Task"}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? "Edit Task" : "Create New Task"}</h3>
          {formError && (
            <p style={{ color: "#ef4444", marginBottom: "15px" }}>
              {formError}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Task Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Status</label>
              <select
                className="custom-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div className="input-group">
              <label>Assign to Project</label>
              <select
                className="custom-select"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                required
              >
                <option value="">-- Select a Project --</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-primary">
              {editingId ? "Update Task" : "Save Task"}
            </button>
          </form>
        </div>
      )}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Project</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedTasks.map((task) => (
              <tr key={task._id}>
                <td style={{ fontWeight: "500", color: "#111827" }}>
                  {task.title}
                </td>
                <td>{getProjectName(task.projectId)}</td>
                <td>
                  <span
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      backgroundColor:
                        task.status === "Done"
                          ? "#d1fae5"
                          : task.status === "In Progress"
                            ? "#fef3c7"
                            : "#e5e7eb",
                      color:
                        task.status === "Done"
                          ? "#065f46"
                          : task.status === "In Progress"
                            ? "#92400e"
                            : "#374151",
                    }}
                  >
                    {task.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-action btn-edit"
                      onClick={() => handleEditClick(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDelete(task._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {displayedTasks.length === 0 && (
          <div className="empty-state">No tasks found for this project.</div>
        )}
      </div>
    </div>
  );
}

export default Tasks;
