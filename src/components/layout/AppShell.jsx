import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { APP_DOWNLOAD_URL } from "../../config/api";

const nav = [
  { to: "/app", label: "Accueil" },
  { to: "/mes-chemins", label: "Mes chemins" },
  { to: "/favoris", label: "Favoris" },
  { to: "/profil", label: "Profil" },
];

export default function AppShell({ children, compact = false }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className={`shell ${compact ? "shell-compact" : ""}`}>
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand">TEKTAL</div>
        <nav className="nav">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-item ${pathname === item.to ? "active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        
        <a
          className="download-btn"
          href={APP_DOWNLOAD_URL}
          target="_blank"
          rel="noreferrer"
        >
          Télécharger l'application
        </a>
      </aside>

      <main className="content">
        <header className="topbar">
          <button className="menu-btn" onClick={() => setOpen((v) => !v)}>
            ☰
          </button>
          <div className="topbar-title">Tektal Web</div>
        </header>
        <section className="page">{children}</section>
      </main>
    </div>
  );
}
