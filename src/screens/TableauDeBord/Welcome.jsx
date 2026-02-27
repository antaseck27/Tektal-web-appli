

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function Welcome() {
  const [shareToken, setShareToken] = useState("");

  const shareHref = useMemo(() => {
    const token = shareToken.trim();
    // ✅ Pointer vers la route locale /share/:token au lieu du backend
    return token ? `/share/${token}` : "#";
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

        <Link
          className={`btn-secondary ${!shareToken.trim() ? "disabled" : ""}`}
          to={shareHref}
          onClick={(e) => {
            if (!shareToken.trim()) e.preventDefault();
          }}
        >
          Tester un lien de partage
        </Link>
      </div>
    </div>
  );
}
































