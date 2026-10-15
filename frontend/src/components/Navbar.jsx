"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="text-2xl font-bold text-white tracking-tight"
          >
            TaskFlow
          </Link>

          {/* Desktop links - hidden on mobile */}
          <div className="hidden md:flex items-center gap-6">
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
              Admin Panel
            </a>
          </div>

          {/* Hamburger button - only on mobile */}
          <button
            className="md:hidden text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700">
          <div className="px-4 py-4 space-y-2">
            <Link
              href="/"
              className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition"
            >
              Dashboard
            </Link>
            <a
              href="http://localhost:5173"
              className="block px-4 py-3 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-600 transition text-center"
            >
              Admin Panel
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
