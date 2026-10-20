import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "./Tasks.css";

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
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h2>
            {filterProjectId
              ? `Tasks for: ${currentProjectName || "Project"}`
              : "All tasks"}
          </h2>
          <p className="page-description">
            Organize the details and track what comes next.
          </p>
        </div>
        <button
          className={showForm ? "btn-secondary" : "btn-primary"}
          onClick={() => (showForm ? closeForm() : setShowForm(true))}
        >
          <Icon name={showForm ? "close" : "plus"} size={17} />
          {showForm ? "Cancel" : "New Task"}
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
              <label htmlFor="task-title">Task Title</label>
              <input
                id="task-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="task-description">Description</label>
              <textarea
                id="task-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="task-status">Status</label>
              <select
                id="task-status"
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
              <label htmlFor="task-project">Assign to Project</label>
              <select
                id="task-project"
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
                <td style={{ fontWeight: "600", color: "#172337" }}>
                  {task.title}
                </td>
                <td>{getProjectName(task.projectId)}</td>
                <td>
                  <span
                    className={`status-badge ${task.status === "Done" ? "status-done" : task.status === "In Progress" ? "status-progress" : "status-todo"}`}
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
                      <Icon name="edit" size={15} /> Edit
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDelete(task._id)}
                    >
                      <Icon name="trash" size={15} /> Delete
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
