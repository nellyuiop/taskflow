import Navbar from "../../components/Navbar";
import Link from "next/link";

async function getData() {
  const [projectsRes, tasksRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/projects`, {
      cache: "no-store",
    }),
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/tasks`, {
      cache: "no-store",
    }),
  ]);

  if (!projectsRes.ok || !tasksRes.ok) {
    throw new Error("Failed to fetch data");
  }

  const projects = await projectsRes.json();
  const tasks = await tasksRes.json();
  return { projects, tasks };
}

export default async function DashboardPage() {
  const { projects, tasks } = await getData();

  const getTasksForProject = (projectId) => {
    return tasks.filter((t) => t.projectId === projectId);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
            Public Dashboard
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            A live look at all active projects and tasks.
          </p>
        </div>

        {projects.length === 0 && (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500">
            No projects yet. Visit the Admin Panel to create one!
          </div>
        )}

        <div className="space-y-8">
          {projects.map((project) => {
            const projectTasks = getTasksForProject(project._id);
            const doneCount = projectTasks.filter(
              (t) => t.status === "Done",
            ).length;
            const progress =
              projectTasks.length > 0
                ? (doneCount / projectTasks.length) * 100
                : 0;

            return (
              <Link
                key={project._id}
                href={`/dashboard/projects/${project._id}`}
                className="block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 hover:border-slate-300 transition-all duration-200"
              >
                {/* Project Header */}
                <div className="p-6 border-b border-slate-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800">
                        {project.name}
                      </h2>
                      <p className="mt-1 text-slate-600">
                        {project.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-slate-500 text-sm font-medium justify-end">
                        View Details <span className="text-lg">→</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-700 mt-2 block">
                        {doneCount} / {projectTasks.length} Tasks
                      </span>
                      <div className="w-32 h-2 bg-slate-100 rounded-full mt-2 overflow-hidden ml-auto">
                        <div
                          className="h-full bg-slate-700 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tasks Preview */}
                <div className="bg-slate-50 p-6">
                  {projectTasks.length === 0 ? (
                    <p className="text-slate-500 text-sm italic">
                      No tasks yet for this project.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {projectTasks.slice(0, 3).map((task) => (
                        <li
                          key={task._id}
                          className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-3 h-3 rounded-full ${
                                task.status === "Done"
                                  ? "bg-green-500"
                                  : task.status === "In Progress"
                                    ? "bg-yellow-500"
                                    : "bg-slate-400"
                              }`}
                            ></span>
                            <span className="font-medium text-slate-700">
                              {task.title}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            {task.status}
                          </span>
                        </li>
                      ))}
                      {projectTasks.length > 3 && (
                        <li className="text-sm text-slate-500 italic text-center pt-2">
                          + {projectTasks.length - 3} more tasks — click to view
                          all
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
