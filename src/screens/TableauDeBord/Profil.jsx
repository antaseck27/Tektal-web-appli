// export default function Profil() {
//   return (
//     <div className="card">
//       <h2>Profil</h2>
//       <p>Informations utilisateur.</p>
//     </div>
//   );
// }


import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, logout } from "../../services/authService";
import { getFavorites, getPaths } from "../../services/pathService";

export default function Profil() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const [user, setUser] = useState({
    name: "Utilisateur",
    email: "",
    campus: "Bakeli Dakar",
    role: "user",
    createdPaths: 0,
    savedPaths: 0,
  });

  const initials = useMemo(() => {
    const base = (user.name || user.email || "U").trim();
    const parts = base.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return "U";
  }, [user.name, user.email]);

  const normalizeList = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.results)) return payload.results;
    if (Array.isArray(payload?.data?.results)) return payload.data.results;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
  };

  const loadAll = useCallback(async () => {
    try {
      const [profileRes, favRes, pathsRes] = await Promise.all([
        getProfile(),
        getFavorites(),
        getPaths(),
      ]);

      if (!profileRes?.ok) return;

      const u = profileRes.data || {};
      const favoritesCount = favRes?.ok ? normalizeList(favRes.data).length : 0;

      const allPaths = pathsRes?.ok ? normalizeList(pathsRes.data) : [];
      const createdCount = allPaths.filter((p) => {
        const ownerId =
          p.user?.id ?? p.owner?.id ?? p.author?.id ?? p.creator_id ?? p.user_id;
        const ownerEmail =
          p.user?.email ?? p.owner?.email ?? p.author?.email ?? p.creator_email;
        return (
          (ownerId && u.id && Number(ownerId) === Number(u.id)) ||
          (ownerEmail && u.email && ownerEmail.toLowerCase() === u.email.toLowerCase())
        );
      }).length;

      setUser((prev) => ({
        ...prev,
        name: u.full_name || u.name || (u.email ? u.email.split("@")[0] : "Utilisateur"),
        email: u.email || "",
        campus: u.campus || prev.campus,
        role: u.role || "user",
        createdPaths: createdCount,
        savedPaths: favoritesCount,
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleLogout = async () => {
    if (loggingOut) return;
    const ok = window.confirm("Voulez-vous vraiment vous déconnecter ?");
    if (!ok) return;

    setLoggingOut(true);
    try {
      logout();
      navigate("/login", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] grid place-items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-amber-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-10">
      <div className="bg-gradient-to-r from-amber-400 to-yellow-300 pt-14 pb-8 text-center">
        <div className="mx-auto mb-4 grid h-24 w-24 place-items-center rounded-full bg-white text-3xl font-extrabold text-amber-500">
          {initials}
        </div>
        <h1 className="text-2xl font-extrabold text-white">{user.name}</h1>
        <p className="text-white/90">{user.campus}</p>
        {!!user.email && <p className="text-sm text-white/90 mt-1">{user.email}</p>}
      </div>

      <div className="mx-auto -mt-5 grid max-w-xl grid-cols-2 gap-3 px-4">
        <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
          <p className="text-3xl font-extrabold text-amber-500">{user.createdPaths}</p>
          <p className="text-sm text-slate-600">Chemins créés</p>
        </div>
        <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
          <p className="text-3xl font-extrabold text-amber-500">{user.savedPaths}</p>
          <p className="text-sm text-slate-600">Favoris</p>
        </div>
      </div>

      <div className="mx-auto mt-4 max-w-xl px-4">
        <div className="rounded-2xl bg-white p-2 shadow-sm">
          <button onClick={() => navigate("/mes-chemins")} className="w-full rounded-xl px-4 py-3 text-left hover:bg-slate-50">
            Mes chemins
          </button>
          <button onClick={() => navigate("/favoris")} className="w-full rounded-xl px-4 py-3 text-left hover:bg-slate-50">
            Favoris
          </button>
          <button onClick={() => navigate("/profil/edit")} className="w-full rounded-xl px-4 py-3 text-left hover:bg-slate-50">
            Modifier le profil
          </button>

          <div className="my-2 h-px bg-slate-100" />

          <button onClick={() => navigate("/parametres")} className="w-full rounded-xl px-4 py-3 text-left hover:bg-slate-50">
            Paramètres
          </button>
          <button onClick={() => navigate("/aide")} className="w-full rounded-xl px-4 py-3 text-left hover:bg-slate-50">
            Aide
          </button>

          <div className="my-2 h-px bg-slate-100" />

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full rounded-xl px-4 py-3 text-left text-red-500 hover:bg-red-50 disabled:opacity-70"
          >
            {loggingOut ? "Déconnexion..." : "Déconnexion"}
          </button>
        </div>

        <p className="mt-5 text-center text-xs text-slate-400">Version 1.0.0 (MVP)</p>
      </div>
    </div>
  );
}
