import { useState, useEffect } from "react";
import axios from "axios";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for the form
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");

  // Fetch projects from the backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:5001/api/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch projects.");
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Handle creating a new project
  const handleCreateProject = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      const token = localStorage.getItem("token");

      // Send POST request to backend
      const response = await axios.post(
        "http://127.0.0.1:5001/api/projects",
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Add the new project to the existing list instantly (no refresh needed!)
      setProjects([...projects, response.data]);

      // Clear the form and close it
      setName("");
      setDescription("");
      setShowForm(false);
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create project.");
    }
  };

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Projects Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: "10px 15px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {showForm ? "Cancel" : "+ New Project"}
        </button>
      </div>

      {/* CREATE PROJECT FORM */}
      {showForm && (
        <div
          style={{
            background: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
            marginTop: "20px",
            border: "1px solid #ddd",
          }}
        >
          <h3>Create New Project</h3>
          {formError && <p style={{ color: "red" }}>{formError}</p>}

          <form onSubmit={handleCreateProject}>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Project Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  minHeight: "60px",
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: "10px 15px",
                background: "#10b981",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Save Project
            </button>
          </form>
        </div>
      )}

      {/* PROJECTS TABLE */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
          background: "white",
        }}
      >
        <thead>
          <tr style={{ background: "#f4f4f4", textAlign: "left" }}>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
              Project Name
            </th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
              Description
            </th>
            <th style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
              Created At
            </th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project._id}>
              <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                {project.name}
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                {project.description}
              </td>
              <td style={{ padding: "10px", borderBottom: "1px solid #eee" }}>
                {new Date(project.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Projects;
