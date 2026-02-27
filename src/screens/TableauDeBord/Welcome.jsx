

// import { useMemo, useState } from "react";
// import { Link } from "react-router-dom";

// export default function Welcome() {
//   const [shareToken, setShareToken] = useState("");

//   const shareHref = useMemo(() => {
//     const token = shareToken.trim();
//     // ✅ Pointer vers la route locale /share/:token au lieu du backend
//     return token ? `/share/${token}` : "#";
//   }, [shareToken]);

//   return (
//     <div className="welcome">
//       <h1>TEKTAL</h1>
//       <p>Suivez un chemin partagé en un clic, même sans application mobile.</p>

//       <div className="welcome-actions">
//         <Link className="btn-primary" to="/app">Entrer</Link>

//         <input
//           type="text"
//           placeholder="Collez un share_token"
//           value={shareToken}
//           onChange={(e) => setShareToken(e.target.value)}
//         />

//         <Link
//           className={`btn-secondary ${!shareToken.trim() ? "disabled" : ""}`}
//           to={shareHref}
//           onClick={(e) => {
//             if (!shareToken.trim()) e.preventDefault();
//           }}
//         >
//           Tester un lien de partage
//         </Link>
//       </div>
//     </div>
//   );
// }



import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  const openShare = () => {
    const raw = value.trim();
    if (!raw) return;

    let token = raw;
    if (raw.startsWith("http")) {
      const after = raw.split("/share/")[1] || "";
      token = after.split("/")[0];
    }
    token = token.replaceAll("/", "");

    if (token) navigate(`/share/${encodeURIComponent(token)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 grid place-items-center px-6">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-extrabold text-slate-900">TEKTAL</h1>
        <p className="mt-2 text-slate-600">Visualisez un chemin partagé.</p>

        <div className="mt-6 flex gap-2">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Collez le lien ou le token"
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none"
          />
          <button
            onClick={openShare}
            className="rounded-xl bg-amber-400 px-4 py-3 font-bold text-slate-900"
          >
            Ouvrir
          </button>
        </div>
      </div>
    </div>
  );
}






































import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function Welcome() {
  const [shareToken, setShareToken] = useState("");

  const shareHref = useMemo(() => {
    const token = shareToken.trim();
    return token ? `/share/${token}` : "#";
  }, [shareToken]);

  return (
    <div className="welcome">
      <h1>TEKTAL</h1>
      <p>Suivez un chemin partagé en un clic, même sans application mobile.</p>

      <div className="welcome-actions">
        <Link className="btn-primary" to="/login">
          Entrer
        </Link>

        <div className="share-test-section">
          <p className="share-label">Tester un lien de partage :</p>
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
            Voir le chemin
          </Link>
        </div>

        <p className="register-link">
          Pas encore de compte ?{' '}
          <Link to="/register">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
}