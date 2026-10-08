import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold text-white tracking-tight"
            >
              TaskFlow
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link
              href="/"
              className="text-slate-300 hover:text-white font-medium transition"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-slate-300 hover:text-white font-medium transition"
            >
              Dashboard
            </Link>
            <a
              href="http://localhost:5173"
              className="px-4 py-2 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition"
            >
              Admin Login
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
