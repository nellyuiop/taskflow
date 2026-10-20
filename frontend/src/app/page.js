import Link from "next/link";
import Navbar from "../components/Navbar";

function Icon({ name, size = 22 }) {
  const paths = {
    folder:
      "M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z",
    tasks: "m3 6 2 2 4-4M12 6h9M3 13l2 2 4-4M12 13h9M12 20h9",
    progress: "M4 19V5M4 19h16M8 15l4-4 4 2 5-8M17 5h4v4",
    arrow: "M5 12h14m-5-5 5 5-5 5",
  };

  return (
    <svg
      width={size}
      height={size}
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

const features = [
  {
    icon: "folder",
    title: "Organize projects",
    description:
      "Keep your projects in one place, with their details and tasks close at hand.",
  },
  {
    icon: "tasks",
    title: "Track tasks",
    description:
      "Create tasks, assign them to projects, and update their status as work progresses.",
  },
  {
    icon: "progress",
    title: "Stay focused",
    description:
      "Spend less time searching through spreadsheets and more time getting work done.",
  },
];

export default function Home() {
  return (
    <div className="tf-home">
      <Navbar />

      <main className="tf-home-main">
        <section className="tf-hero" aria-labelledby="hero-title">
          <h1 id="hero-title">
            Manage your projects
            <br />
            <span>effortlessly.</span>
          </h1>

          <p className="tf-hero-description">
            Bring your projects and tasks together in one simple workspace. Stay
            organized and keep work moving.
          </p>

          <Link href="/dashboard" className="tf-dashboard-button">
            View Dashboard
            <Icon name="arrow" size={18} />
          </Link>
        </section>

        <section className="tf-features" aria-label="TaskFlow features">
          {features.map((feature) => (
            <article className="tf-feature-card" key={feature.title}>
              <div className="tf-feature-icon">
                <Icon name={feature.icon} />
              </div>

              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
            </article>
          ))}
        </section>
      </main>

      <footer className="tf-site-footer">
        <div className="tf-footer-inner">
          <p>© 2026 TaskFlow Compu-Vision</p>

          <nav aria-label="Footer navigation">
            <Link href="/">Home</Link>
            <Link href="/dashboard">Dashboard</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
