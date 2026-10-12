import Navbar from "../../../../components/Navbar";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getProjectData(id) {
  try {
    const [projectRes, tasksRes] = await Promise.all([
      fetch(`http://127.0.0.1:5001/api/public/projects/${id}`, {
        cache: "no-store",
      }),
      fetch(`http://127.0.0.1:5001/api/public/tasks`, { cache: "no-store" }),
    ]);

    if (!projectRes.ok) return null;

    const project = await projectRes.json();
    const allTasks = await tasksRes.json();
    const tasks = allTasks.filter((t) => t.projectId === id);

    return { project, tasks };
  } catch (err) {
    return null;
  }
}

export default async function ProjectDetailPage({ params }) {
  // In Next.js 15+, params is a Promise, so we await it
  const { id } = await params;
  const data = await getProjectData(id);

  if (!data) {
    notFound(); // Shows the default 404 page
  }

  const { project, tasks } = data;
  const doneCount = tasks.filter((t) => t.status === "Done").length;
  const progress = tasks.length > 0 ? (doneCount / tasks.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center text-slate-500 hover:text-slate-800 font-medium mb-8 transition"
        >
          ← Back to Dashboard
        </Link>

        {/* Project Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
            {project.name}
          </h1>
          <p className="mt-3 text-lg text-slate-600">{project.description}</p>

          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-700">
              {doneCount} of {tasks.length} tasks completed
            </span>
            <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-700 transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">All Tasks</h2>

          {tasks.length === 0 ? (
            <p className="text-slate-500 italic">
              No tasks have been added to this project yet.
            </p>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        task.status === "Done"
                          ? "bg-green-500"
                          : task.status === "In Progress"
                            ? "bg-yellow-500"
                            : "bg-slate-400"
                      }`}
                    ></span>
                    <div>
                      <p className="font-medium text-slate-700">{task.title}</p>
                      <p className="text-sm text-slate-500">
                        {task.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-1 bg-slate-100 rounded-full">
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
