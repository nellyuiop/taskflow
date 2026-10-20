import Link from "next/link";
import Navbar from "../../components/Navbar";

async function getData() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

  if (!apiUrl) {
    throw new Error("API URL is not configured.");
  }

  const [projectsRes, tasksRes] = await Promise.all([
    fetch(`${apiUrl}/api/public/projects`, { cache: "no-store" }),
    fetch(`${apiUrl}/api/public/tasks`, { cache: "no-store" }),
  ]);

  if (!projectsRes.ok || !tasksRes.ok) {
    throw new Error("Unable to load projects.");
  }

  const [projects, tasks] = await Promise.all([
    projectsRes.json(),
    tasksRes.json(),
  ]);

  if (!Array.isArray(projects) || !Array.isArray(tasks)) {
    throw new Error("Unexpected response.");
  }

  return { projects, tasks };
}

export default async function DashboardPage() {
  let data;

  try {
    data = await getData();
  } catch {
    return (
      <div className="tf-page-shell">
        <Navbar />
        <main className="tf-workspace">
          <div className="tf-feedback" role="alert">
            <h1>Unable to load projects</h1>
            <p>Please try again in a moment.</p>
            <a href="/dashboard" className="tf-dashboard-button">
              Try again
            </a>
          </div>
        </main>
      </div>
    );
  }

  const { projects, tasks } = data;

  return (
    <div className="tf-page-shell">
      <Navbar />

      <main className="tf-workspace">
        <header className="tf-workspace-heading">
          <div>
            <h1>Projects</h1>
            <p>Choose a project to explore its tasks and progress.</p>
          </div>

          <span className="tf-counter">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </span>
        </header>

        {projects.length === 0 ? (
          <div className="tf-empty">
            <h2>No projects yet</h2>
            <p>Projects will appear here once they have been added.</p>
          </div>
        ) : (
          <div className="tf-project-grid">
            {projects.map((project) => {
              const projectTasks = tasks.filter(
                (task) =>
                  String(task.projectId?._id ?? task.projectId) ===
                  String(project._id),
              );

              const doneCount = projectTasks.filter(
                (task) => task.status === "Done",
              ).length;

              return (
                <Link
                  key={project._id}
                  href={`/dashboard/projects/${encodeURIComponent(project._id)}`}
                  className="tf-project-card"
                >
                  <div className="tf-project-card-top">
                    <span className="tf-folder-icon">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
                      </svg>
                    </span>

                    <svg
                      className="tf-card-arrow"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14m-5-5 5 5-5 5" />
                    </svg>
                  </div>

                  <h2>{project.name}</h2>
                  <p className="tf-project-description">
                    {project.description || "No description provided."}
                  </p>

                  <div className="tf-project-card-bottom">
                    <div className="tf-progress-label">
                      <span>
                        {projectTasks.length === 0
                          ? "No tasks yet"
                          : `${doneCount} of ${projectTasks.length} completed`}
                      </span>
                      <span>View project</span>
                    </div>

                    <progress
                      className="tf-progress"
                      value={doneCount}
                      max={projectTasks.length || 1}
                      aria-label={`${project.name}: ${doneCount} of ${projectTasks.length} tasks completed`}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
