import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Projects.css";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/projects`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setProjects(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch projects.");
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingId) {
        const response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/projects/${editingId}`,
          { name, description },
          config,
        );
        setProjects(
          projects.map((p) => (p._id === editingId ? response.data : p)),
        );
      } else {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/projects`,
          { name, description },
          config,
        );
        setProjects([...projects, response.data]);
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

  const handleEditClick = (project) => {
    setEditingId(project._id);
    setName(project.name);
    setDescription(project.description);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(projects.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete project.");
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setName("");
    setDescription("");
    setFormError("");
  };

  if (loading) return <div className="spinner"></div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Projects Management</h2>
        <button
          className={showForm ? "btn-secondary" : "btn-primary"}
          onClick={() => (showForm ? closeForm() : setShowForm(true))}
        >
          {showForm ? "Cancel" : "+ New Project"}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? "Edit Project" : "Create New Project"}</h3>
          {formError && (
            <p style={{ color: "#ef4444", marginBottom: "15px" }}>
              {formError}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Project Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
            <button type="submit" className="btn-primary">
              {editingId ? "Update Project" : "Save Project"}
            </button>
          </form>
        </div>
      )}

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id}>
                <td style={{ fontWeight: "500", color: "#111827" }}>
                  {project.name}
                </td>
                <td>{project.description}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-action btn-view"
                      onClick={() =>
                        navigate(`/tasks?projectId=${project._id}`)
                      }
                    >
                      Tasks &rarr;
                    </button>

                    <div className="secondary-actions">
                      <button
                        className="btn-action btn-edit"
                        onClick={() => handleEditClick(project)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDelete(project._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {projects.length === 0 && (
          <div className="empty-state">
            No projects found. Create one to get started!
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;
