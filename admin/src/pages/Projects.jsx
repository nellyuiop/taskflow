import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Projects.css";
import "./Projects.refresh.css";

const API = "http://127.0.0.1:5001/api/projects";

function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [reload, setReload] = useState(0);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const mutationLock = useRef(false);
  const dialog = useRef(null);
  const cancelDelete = useRef(null);
  const nameInput = useRef(null);
  const formCard = useRef(null);
  const newButton = useRef(null);

  const headers = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : null;
  };

  const expireSession = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return () => controller.abort();
    }
    setLoading(true);
    setError("");
    axios
      .get(API, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      })
      .then(({ data }) => {
        if (!active) return;
        if (!Array.isArray(data))
          throw new Error("Unexpected project response");
        setProjects(data);
      })
      .catch((err) => {
        if (!active || axios.isCancel(err)) return;
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
        } else {
          setError(
            err.response?.status === 403
              ? "You do not have permission to view these projects."
              : "We couldn't load your projects. Please try again.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [navigate, reload]);

  useEffect(() => {
    if (showForm) {
      formCard.current?.scrollIntoView({ behavior: "auto", block: "nearest" });
      nameInput.current?.focus();
    }
  }, [showForm, editingId]);

  useEffect(() => {
    if (!deleteTarget) return;
    const previousFocus = document.activeElement;
    const element = dialog.current;
    element.showModal();
    cancelDelete.current?.focus();
    return () => {
      element.close();
      if (previousFocus?.isConnected) previousFocus.focus();
      else newButton.current?.focus();
    };
  }, [deleteTarget]);

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setName("");
    setDescription("");
    setFormError("");
    newButton.current?.focus();
  };

  const openForm = (project = null) => {
    if (mutationLock.current) return;
    setEditingId(project?._id ?? null);
    setName(project?.name ?? "");
    setDescription(project?.description ?? "");
    setFormError("");
    setNotice("");
    setShowForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (mutationLock.current) return;
    const cleanName = name.trim();
    const cleanDescription = description.trim();
    if (!cleanName || !cleanDescription) {
      setFormError("Enter a project name and description.");
      return;
    }
    const authHeaders = headers();
    if (!authHeaders) {
      expireSession();
      return;
    }
    mutationLock.current = true;
    setSaving(true);
    setFormError("");
    setNotice("");
    try {
      const payload = { name: cleanName, description: cleanDescription };
      const config = { headers: authHeaders };
      const { data } =
        editingId !== null
          ? await axios.put(
              `${API}/${encodeURIComponent(editingId)}`,
              payload,
              config,
            )
          : await axios.post(API, payload, config);
      if (!data || typeof data !== "object" || !data._id) {
        setError(
          "The server returned an unexpected response. Reload projects before trying again.",
        );
        closeForm();
        return;
      }
      setProjects((current) =>
        editingId !== null
          ? current.map((project) =>
              project._id === editingId ? data : project,
            )
          : [...current, data],
      );
      setNotice(editingId !== null ? "Project updated." : "Project created.");
      closeForm();
    } catch (err) {
      if (err.response?.status === 401) expireSession();
      else
        setFormError(
          err.response?.status === 403
            ? "You do not have permission to save this project."
            : "Couldn't save the project. Please try again.",
        );
    } finally {
      mutationLock.current = false;
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || mutationLock.current) return;
    const authHeaders = headers();
    if (!authHeaders) {
      expireSession();
      return;
    }
    mutationLock.current = true;
    setDeleting(true);
    setDeleteError("");
    setNotice("");
    try {
      await axios.delete(`${API}/${encodeURIComponent(deleteTarget._id)}`, {
        headers: authHeaders,
      });
      setProjects((current) =>
        current.filter((project) => project._id !== deleteTarget._id),
      );
      if (editingId === deleteTarget._id) closeForm();
      setDeleteTarget(null);
      setNotice("Project deleted.");
    } catch (err) {
      if (err.response?.status === 401) expireSession();
      else
        setDeleteError(
          err.response?.status === 403
            ? "You do not have permission to delete this project."
            : "Couldn't delete the project. Please try again.",
        );
    } finally {
      mutationLock.current = false;
      setDeleting(false);
    }
  };

  const query = search.trim().toLowerCase();
  const filtered = projects.filter((project) =>
    `${project.name ?? ""} ${project.description ?? ""}`
      .toLowerCase()
      .includes(query),
  );

  return (
    <section className="tf-projects" aria-labelledby="projects-title">
      <div className="tf-page-heading">
        <div>
          <p className="tf-eyebrow">YOUR WORKSPACE</p>
          <h1 id="projects-title">Projects</h1>
          <p className="tf-subtitle">
            Manage your projects and keep work moving.
          </p>
        </div>
        <button
          ref={newButton}
          type="button"
          className="tf-button tf-primary"
          disabled={saving || deleting || loading || Boolean(error)}
          onClick={() => (showForm ? closeForm() : openForm())}
        >
          {showForm ? "Cancel" : "+ New project"}
        </button>
      </div>

      <p className="tf-notice" role="status">
        {notice}
      </p>
      {error && (
        <div className="tf-feedback" role="alert">
          <p>{error}</p>
          <button
            type="button"
            className="tf-button tf-secondary"
            onClick={() => setReload((value) => value + 1)}
          >
            Reload projects
          </button>
        </div>
      )}

      {showForm && (
        <div className="tf-form-card" ref={formCard}>
          <h2>{editingId !== null ? "Edit project" : "Create a project"}</h2>
          <p className="tf-subtitle">
            Give your project a name and a short description.
          </p>
          {formError && (
            <p className="tf-feedback" role="alert">
              {formError}
            </p>
          )}
          <form onSubmit={handleSubmit} aria-busy={saving}>
            <fieldset disabled={saving || deleting}>
              <div className="tf-field">
                <label htmlFor="project-name">Project name</label>
                <input
                  ref={nameInput}
                  id="project-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Website redesign"
                  required
                />
              </div>
              <div className="tf-field">
                <label htmlFor="project-description">Description</label>
                <textarea
                  id="project-description"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="What is this project about?"
                  rows={3}
                  required
                />
              </div>
              <div className="tf-form-actions">
                <button
                  type="button"
                  className="tf-button tf-secondary"
                  onClick={closeForm}
                >
                  Cancel
                </button>
                <button type="submit" className="tf-button tf-primary">
                  {saving
                    ? "Saving..."
                    : editingId !== null
                      ? "Save changes"
                      : "Create project"}
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      )}

      {!error && (
        <div className="tf-project-card" aria-busy={loading}>
          <div className="tf-toolbar">
            <div className="tf-list-title">
              <h2>All projects</h2>
              {!loading && <span className="tf-count">{projects.length}</span>}
            </div>
            <div className="tf-search">
              <label className="tf-sr-only" htmlFor="project-search">
                Search projects by name or description
              </label>
              <input
                id="project-search"
                type="search"
                placeholder="Search projects..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          {loading ? (
            <p className="tf-empty" role="status">
              Loading your projects...
            </p>
          ) : projects.length === 0 ? (
            <div className="tf-empty">
              <h3>Your next project starts here</h3>
              <p>Create a project, then add its tasks.</p>
              <button
                type="button"
                className="tf-button tf-primary"
                onClick={() => openForm()}
              >
                + Create a project
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="tf-empty">
              <h3>No matching projects</h3>
              <p>Try another name or description.</p>
              <button
                type="button"
                className="tf-button tf-secondary"
                onClick={() => setSearch("")}
              >
                Clear search
              </button>
            </div>
          ) : (
            <>
              <div
                className="tf-table-scroll"
                role="region"
                aria-label="Projects table"
                tabIndex={0}
              >
                <table className="tf-table">
                  <thead>
                    <tr>
                      <th scope="col">Project</th>
                      <th scope="col">Description</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((project) => (
                      <tr key={project._id}>
                        <td>
                          <span className="tf-project-name">
                            {project.name}
                          </span>
                        </td>
                        <td className="tf-description">
                          {project.description || "No description"}
                        </td>
                        <td>
                          <div className="tf-row-actions">
                            <button
                              type="button"
                              className="tf-button tf-view"
                              onClick={() =>
                                navigate(
                                  `/tasks?projectId=${encodeURIComponent(project._id)}`,
                                )
                              }
                            >
                              View tasks <span aria-hidden="true">→</span>
                            </button>
                            <button
                              type="button"
                              className="tf-button tf-edit"
                              disabled={saving || deleting}
                              onClick={() => openForm(project)}
                              aria-label={`Edit ${project.name}`}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="tf-button tf-delete"
                              disabled={saving || deleting}
                              onClick={() => {
                                setDeleteError("");
                                setDeleteTarget(project);
                              }}
                              aria-label={`Delete ${project.name}`}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="tf-table-footer" role="status">
                Showing {filtered.length} of {projects.length} projects
              </p>
            </>
          )}
        </div>
      )}

      {deleteTarget && (
        <dialog
          ref={dialog}
          className="tf-delete-dialog"
          aria-labelledby="delete-title"
          aria-describedby="delete-description"
          onCancel={(event) => {
            event.preventDefault();
            if (!mutationLock.current) setDeleteTarget(null);
          }}
        >
          <h2 id="delete-title">Delete project?</h2>
          <p id="delete-description">
            You are about to delete <strong>{deleteTarget.name}</strong>. This
            action cannot be undone.
          </p>
          {deleteError && (
            <p className="tf-feedback" role="alert">
              {deleteError}
            </p>
          )}
          <div className="tf-dialog-actions">
            <button
              ref={cancelDelete}
              type="button"
              className="tf-button tf-secondary"
              disabled={deleting}
              onClick={() => setDeleteTarget(null)}
            >
              Keep project
            </button>
            <button
              type="button"
              className="tf-button tf-danger"
              disabled={deleting}
              onClick={handleDelete}
            >
              {deleting ? "Deleting..." : "Delete project"}
            </button>
          </div>
        </dialog>
      )}
    </section>
  );
}

export default Projects;
