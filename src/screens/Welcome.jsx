

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const BACKEND_BASE_URL = "https://tektal-backend.onrender.com";

export default function Welcome() {
  const [shareToken, setShareToken] = useState("");

  const shareHref = useMemo(() => {
    const token = shareToken.trim();
    return token ? `${BACKEND_BASE_URL}/share/${token}/` : "#";
  }, [shareToken]);

  return (
    <div className="welcome">
      <h1>TEKTAL</h1>
      <p>Suivez un chemin partagé en un clic, même sans application mobile.</p>

      <div className="welcome-actions">
        <Link className="btn-primary" to="/app">Entrer</Link>

        <input
          type="text"
          placeholder="Collez un share_token"
          value={shareToken}
          onChange={(e) => setShareToken(e.target.value)}
        />

        <a
          className={`btn-secondary ${!shareToken.trim() ? "disabled" : ""}`}
          href={shareHref}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => {
            if (!shareToken.trim()) e.preventDefault();
          }}
        >
          Tester un lien de partage
        </a>
      </div>
    </div>
  );
}
