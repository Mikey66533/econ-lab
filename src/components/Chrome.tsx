import Link from "next/link";
export function Header({ lesson = false }: { lesson?: boolean }) {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="Econ Lab home">
        <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
          <path
            d="M5 5v22h23M7 21l19-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path d="M7 26L26 5" fill="none" stroke="#8b659d" strokeWidth="1.8" />
        </svg>
        Econ <span>Lab</span>
        <span className="brand-period">.</span>
      </Link>
      <span className="header-note">Ideas, with the moving parts exposed.</span>
      <Link className="header-link" href={lesson ? "/" : "/#library"}>
        {lesson ? "← All models" : "Explore the models"}{" "}
        <span aria-hidden="true">{lesson ? "" : "↗"}</span>
      </Link>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <span>
        Built with curiosity by{" "}
        <a
          href="https://www.linkedin.com/in/michael-galvin-0b4b6424a"
          target="_blank"
          rel="noreferrer"
        >
          Michael Galvin ↗
        </a>
      </span>
      <span>A personal learning project · Columbia GU4710</span>
      <span>Intuition first. Math always available.</span>
    </footer>
  );
}
