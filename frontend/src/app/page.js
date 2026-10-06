export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50">
      <h1 className="text-5xl font-bold text-slate-800 tracking-tight">
        Welcome to TaskFlow
      </h1>
      <p className="mt-6 text-xl text-slate-600">
        Your public project management platform.
      </p>
      <div className="mt-10">
        <a
          href="/dashboard"
          className="px-6 py-3 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 transition"
        >
          Go to Dashboard
        </a>
      </div>
    </main>
  );
}
