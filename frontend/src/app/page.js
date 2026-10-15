import Navbar from "../components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-800 tracking-tight leading-tight">
          Manage your projects <br className="hidden md:block" />
          <span className="text-slate-500">effortlessly.</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-slate-600">
          TaskFlow helps teams organize their projects and tasks in one simple,
          beautiful dashboard. Stop juggling spreadsheets and start getting work
          done.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto sm:max-w-none">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-8 py-3 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 transition shadow-sm"
          >
            View Dashboard
          </Link>
          <a
            href="http://localhost:5173"
            className="w-full sm:w-auto px-8 py-3 bg-white text-slate-700 border border-slate-300 rounded-lg font-semibold hover:bg-slate-100 transition"
          >
            Admin Panel
          </a>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
            <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center text-2xl mb-6">
              📁
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">
              Organize Projects
            </h3>
            <p className="text-slate-600">
              Keep all your projects in one place. Track progress and never lose
              sight of your goals.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
            <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center text-2xl mb-6">
              ✅
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">
              Track Tasks
            </h3>
            <p className="text-slate-600">
              Create, assign, and complete tasks with a simple status system.
              Todo, In Progress, Done.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
            <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center text-2xl mb-6">
              🚀
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">
              Stay Productive
            </h3>
            <p className="text-slate-600">
              Our clean interface helps your team focus on what matters: getting
              the work done.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-center md:text-left">
            <p className="text-sm">© 2026 TaskFlow Compu-Vision</p>
            <div className="flex gap-6">
              <Link href="/" className="hover:text-slate-800 transition">
                Home
              </Link>
              <Link
                href="/dashboard"
                className="hover:text-slate-800 transition"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
