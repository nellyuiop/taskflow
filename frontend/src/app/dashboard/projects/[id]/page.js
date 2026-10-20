import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../../../components/Navbar";

async function getProjectData(id) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

  if (!apiUrl) {
    throw new Error("API URL is not configured.");
  }

  const [projectRes, tasksRes] = await Promise.all([
    fetch(`${apiUrl}/api/public/projects/${encodeURIComponent(id)}`, {
      cache: "no-store",
    }),
    fetch(`${apiUrl}/api/public/tasks`, {
      cache: "no-store",
    }),
  ]);

  if (projectRes.status === 404) return null;

  if (!projectRes.ok || !tasksRes.ok) {
    throw new Error("Unable to load project.");
  }

  const [project, allTasks] = await Promise.all([
    projectRes.json(),
    tasksRes.json(),
  ]);

  if (!Array.isArray(allTasks)) {
    throw new Error("Unexpected response.");
  }

  const tasks = allTasks.filter(
    (task) => String(task.projectId?._id ?? task.projectId) === String(id),
  );

  return { project, tasks };
}

function statusClass(status) {
  if (status === "Done") return "tf-status-done";
  if (status === "In Progress") return "tf-status-progress";
  return "tf-status-todo";
}

export default async function ProjectDetailPage({ params }) {
  const { id } = await params;
  let data;

  try {
    data = await getProjectData(id);
  } catch {
    return (
      <div className="tf-page-shell">
        <Navbar />
        <main className="tf-workspace">
          <div className="tf-feedback" role="alert">
            <h1>Unable to load this project</h1>
            <p>Please try again in a moment.</p>
            <Link href="/dashboard" className="tf-dashboard-button">
              Back to projects
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!data) notFound();

  const { project, tasks } = data;
  const doneCount = tasks.filter((task) => task.status === "Done").length;

  return (
    <div className="tf-page-shell">
      <Navbar />

      <main className="tf-workspace tf-project-workspace">
        <Link href="/dashboard" className="tf-back-link">
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
          >
            <path d="M19 12H5m5-5-5 5 5 5" />
          </svg>
          All projects
        </Link>

        <header className="tf-project-overview">
          <h1>{project.name}</h1>
          <p>{project.description || "No description provided."}</p>

          <div className="tf-project-progress">
            <span>
              {doneCount} of {tasks.length} tasks completed
            </span>

            <progress
              className="tf-progress"
              value={doneCount}
              max={tasks.length || 1}
              aria-label={`${doneCount} of ${tasks.length} tasks completed`}
            />
          </div>
        </header>

        <section className="tf-task-panel" aria-labelledby="task-heading">
          <div className="tf-task-panel-heading">
            <h2 id="task-heading">Tasks</h2>
            <span className="tf-counter">{tasks.length}</span>
          </div>

          {tasks.length === 0 ? (
            <div className="tf-empty">
              <p>No tasks have been added to this project yet.</p>
            </div>
          ) : (
            <>
              <p className="tf-task-hint">Select a task to view its details.</p>

              {tasks.map((task) => (
                <details className="tf-task" key={task._id}>
                  <summary>
                    <span
                      className={`tf-task-dot ${statusClass(task.status)}`}
                      aria-hidden="true"
                    />

                    <span className="tf-task-title">{task.title}</span>

                    <span className={`tf-status ${statusClass(task.status)}`}>
                      {task.status}
                    </span>

                    <svg
                      className="tf-task-chevron"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </summary>

                  <div className="tf-task-details">
                    <h3>Description</h3>
                    <p>{task.description || "No description provided."}</p>
                  </div>
                </details>
              ))}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
