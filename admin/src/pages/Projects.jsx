import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Projects.css";

function Icon({ name }) {
  const paths = {
    plus: "M12 5v14M5 12h14",
    edit: "m15 5 4 4M4 20l4-1L20 7a2.8 2.8 0 0 0-4-4L4 15v5Z",
    trash: "M3 6h18M9 6V4h6v2M5 6l1 14h12l1-14M10 10v6M14 10v6",
    close: "m6 6 12 12M6 18 18 6",
    arrow: "M5 12h14m-5-5 5 5-5 5",
  };

  return (
    <svg
      width="16"
      height="16"
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

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);

  const mutationLock = useRef(false);
  const nameInput = useRef(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleUnauthorized = (err) => {
    if (err.response?.status !== 401) return false;

    localStorage.removeItem("token");
    window.location.href = "/login";
    return true;
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${apiUrl}/api/projects`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        setProjects(response.data);
      } catch (err) {
        if (axios.isCancel(err)) return;
        if (!handleUnauthorized(err)) {
          setError("Unable to load projects. Please refresh and try again.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchProjects();

    return () => controller.abort();
  }, [apiUrl]);

  useEffect(() => {
    if (showForm) nameInput.current?.focus();
  }, [showForm, editingId]);

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setName("");
    setDescription("");
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (mutationLock.current) return;

    if (!name.trim() || !description.trim()) {
      setFormError("Enter a project name and description.");
      return;
    }

    mutationLock.current = true;
    setBusy(true);
    setFormError("");

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const payload = {
        name: name.trim(),
        description: description.trim(),
      };

      if (editingId) {
        const response = await axios.put(
          `${apiUrl}/api/projects/${encodeURIComponent(editingId)}`,
          payload,
          config,
        );

        setProjects((current) =>
          current.map((project) =>
            project._id === editingId ? response.data : project,
          ),
        );
      } else {
        const response = await axios.post(
          `${apiUrl}/api/projects`,
          payload,
          config,
        );

        setProjects((current) => [...current, response.data]);
      }

      closeForm();
    } catch (err) {
      if (!handleUnauthorized(err)) {
        setFormError("Unable to save this project. Please try again.");
      }
    } finally {
      mutationLock.current = false;
      setBusy(false);
    }
  };

  const handleEditClick = (project) => {
    if (mutationLock.current) return;

    setEditingId(project._id);
    setName(project.name);
    setDescription(project.description || "");
    setFormError("");
    setShowForm(true);
  };

  const handleDelete = async (project) => {
    if (mutationLock.current) return;

    if (!window.confirm(`Delete "${project.name}"? This cannot be undone.`)) {
      return;
    }

    mutationLock.current = true;
    setBusy(true);

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${apiUrl}/api/projects/${encodeURIComponent(project._id)}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setProjects((current) =>
        current.filter((item) => item._id !== project._id),
      );

      if (editingId === project._id) closeForm();
    } catch (err) {
      if (!handleUnauthorized(err)) {
        window.alert("Unable to delete this project. Please try again.");
      }
    } finally {
      mutationLock.current = false;
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="spinner" role="status" aria-label="Loading projects" />
    );
  }

  if (error) {
    return (
      <div className="error-message" role="alert">
        {error}
      </div>
    );
  }

  return (
    <section className="admin-page" aria-labelledby="projects-heading">
      <div className="page-header">
        <div>
          <h2 id="projects-heading">Projects</h2>
          <p className="page-description">
            Select a project to view and manage its tasks.
          </p>
        </div>

        <button
          type="button"
          className={showForm ? "btn-secondary" : "btn-primary"}
          disabled={busy}
          onClick={() => (showForm ? closeForm() : setShowForm(true))}
        >
          <Icon name={showForm ? "close" : "plus"} />
          {showForm ? "Cancel" : "New project"}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? "Edit project" : "Create project"}</h3>

          {formError && (
            <p className="error-message" role="alert">
              {formError}
            </p>
          )}

          <form onSubmit={handleSubmit} aria-busy={busy}>
            <div className="input-group">
              <label htmlFor="project-name">Project name</label>
              <input
                ref={nameInput}
                id="project-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={busy}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="project-description">Description</label>
              <textarea
                id="project-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                disabled={busy}
                rows={3}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={busy}>
              {busy
                ? "Saving..."
                : editingId
                  ? "Save changes"
                  : "Create project"}
            </button>
          </form>
        </div>
      )}

      <div className="table-card projects-table">
        <div className="projects-table-heading">
          <h3>All projects</h3>
          <span className="project-count">{projects.length}</span>
        </div>

        {projects.length === 0 ? (
          <div className="empty-state">
            No projects yet. Create one to get started.
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th scope="col">Project</th>
                <th scope="col">Description</th>
                <th scope="col" className="project-actions-heading">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {projects.map((project) => (
                <tr key={project._id}>
                  <td>
                    <Link
                      className="project-title-link"
                      to={`/tasks?projectId=${encodeURIComponent(project._id)}`}
                      aria-label={`${project.name}: view tasks`}
                    >
                      <span>{project.name}</span>
                      <Icon name="arrow" />
                    </Link>
                  </td>

                  <td className="project-description">
                    {project.description || "No description"}
                  </td>

                  <td>
                    <div className="project-row-actions">
                      <button
                        type="button"
                        className="project-text-action"
                        onClick={() => handleEditClick(project)}
                        disabled={busy}
                        aria-label={`Edit ${project.name}`}
                      >
                        <Icon name="edit" />
                        Edit
                      </button>

                      <button
                        type="button"
                        className="project-text-action project-delete-action"
                        onClick={() => handleDelete(project)}
                        disabled={busy}
                        aria-label={`Delete ${project.name}`}
                      >
                        <Icon name="trash" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

export default Projects;
