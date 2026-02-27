

// import { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getProfile } from "../../services/authService";
// import { getPaths, toggleFavorite } from "../../services/pathService";

// export default function MesChemins() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [paths, setPaths] = useState([]);
//   const [me, setMe] = useState(null);

//   const normalizeList = (payload) => {
//     if (Array.isArray(payload)) return payload;
//     if (Array.isArray(payload?.results)) return payload.results;
//     if (Array.isArray(payload?.data?.results)) return payload.data.results;
//     if (Array.isArray(payload?.data)) return payload.data;
//     return [];
//   };

//   const myPaths = useMemo(() => {
//     if (!me) return paths;
//     return paths.filter((p) => {
//       const ownerId = p.user?.id ?? p.owner?.id ?? p.creator_id;
//       const ownerEmail = p.user?.email ?? p.owner?.email ?? p.creator_email;
//       return ownerId === me.id || ownerEmail === me.email;
//     });
//   }, [paths, me]);

//   const openPath = (path) => {
//     const token = path.share_token || path.id;
//     navigate(`/share/${encodeURIComponent(token)}`);
//   };

//   const loadData = async () => {
//     setError("");
//     try {
//       const [meRes, pathsRes] = await Promise.all([getProfile(), getPaths()]);
//       if (!meRes?.ok) throw new Error(meRes?.data?.detail || "Erreur profil");
//       setMe(meRes.data || null);
//       setPaths(normalizeList(pathsRes));
//     } catch (e) {
//       setError(e.message || "Erreur de chargement");
//     }
//   };

//   useEffect(() => {
//     (async () => {
//       setLoading(true);
//       await loadData();
//       setLoading(false);
//     })();
//   }, []);

//   const onToggleFavorite = async (path) => {
//     const snapshot = paths;
//     setPaths((prev) =>
//       prev.map((p) => (p.id === path.id ? { ...p, isFavorite: !p.isFavorite } : p))
//     );
//     try {
//       await toggleFavorite(path.id);
//     } catch {
//       setPaths(snapshot);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-[60vh] grid place-items-center">
//         <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-amber-400" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50 px-6 py-6">
//       <h1 className="text-3xl font-extrabold text-slate-900">Mes chemins</h1>
//       <p className="mt-1 text-slate-600">Gérez vos trajets publiés.</p>

//       {error && <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-red-700">{error}</div>}

//       {myPaths.length === 0 ? (
//         <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm">
//           <h2 className="text-xl font-bold text-slate-900">Aucun chemin trouvé</h2>
//           <p className="mt-2 text-slate-600">Créez un chemin depuis l’app mobile.</p>
//         </div>
//       ) : (
//         <div className="mt-6 grid gap-3">
//           {myPaths.map((path) => (
//             <article
//               key={path.id || path.share_token}
//               className="grid grid-cols-[96px_1fr_auto] items-center gap-3 rounded-2xl bg-white p-3 shadow-sm"
//             >
//               <button onClick={() => openPath(path)} className="h-24 w-24 overflow-hidden rounded-xl">
//                 <img
//                   src={path.thumbnail || "https://picsum.photos/300/300"}
//                   alt={path.title || "Chemin"}
//                   className="h-full w-full object-cover"
//                 />
//               </button>

//               <button onClick={() => openPath(path)} className="text-left">
//                 <p className="line-clamp-2 font-semibold text-slate-900">
//                   {path.title || "Chemin sans titre"}
//                 </p>
//                 <p className="text-sm text-slate-600">
//                   {path.duration || "-"} • {path.destination || path.end_label || "-"}
//                 </p>
//                 <p className="mt-1 text-xs text-slate-500">
//                   Statut: {path.status || "published"}
//                 </p>
//               </button>

//               <button
//                 onClick={() => onToggleFavorite(path)}
//                 className={`px-2 text-2xl ${path.isFavorite ? "text-red-500" : "text-slate-300"}`}
//                 aria-label="Favori"
//               >
//                 {path.isFavorite ? "♥" : "♡"}
//               </button>
//             </article>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }



import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../services/authService";
import { getPaths, toggleFavorite } from "../../services/pathService";

export default function MesChemins() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paths, setPaths] = useState([]);
  const [me, setMe] = useState(null);

  const normalizeList = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.results)) return payload.results;
    if (Array.isArray(payload?.data?.results)) return payload.data.results;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
  };

  const myPaths = useMemo(() => {
    if (!me) return [];
    return paths.filter((p) => {
      const ownerId =
        p.user?.id ??
        p.owner?.id ??
        p.author?.id ??
        p.creator_id ??
        p.created_by_id ??
        p.user_id;

      const ownerEmail =
        p.user?.email ??
        p.owner?.email ??
        p.author?.email ??
        p.creator_email ??
        p.created_by_email;

      const ownerRaw =
        p.user ??
        p.owner ??
        p.author ??
        p.created_by ??
        null;

      if (ownerId && me.id && Number(ownerId) === Number(me.id)) return true;
      if (ownerEmail && me.email && String(ownerEmail).toLowerCase() === String(me.email).toLowerCase()) return true;

      // fallback si backend renvoie juste une string pour owner
      if (typeof ownerRaw === "string") {
        if (me.email && ownerRaw.toLowerCase() === me.email.toLowerCase()) return true;
      }

      return false;
    });
  }, [paths, me]);

  // fallback d'affichage: si le filtre ne matche rien, on montre tout pour debug/usage
  const visiblePaths = myPaths.length > 0 ? myPaths : paths;

  const openPath = (path) => {
    const token = path.share_token || path.id;
    navigate(`/share/${encodeURIComponent(token)}`);
  };

  const loadData = async () => {
    setError("");
    try {
      const [meRes, pathsRes] = await Promise.all([getProfile(), getPaths()]);

      console.log("meRes:", meRes);
      console.log("pathsRes:", pathsRes);

      if (!meRes?.ok) throw new Error(meRes?.message || meRes?.data?.detail || "Erreur profil");
      if (!pathsRes?.ok) throw new Error(pathsRes?.message || pathsRes?.data?.detail || "Erreur chemins");

      const list = normalizeList(pathsRes.data);
      console.log("normalized paths:", list);

      setMe(meRes.data || null);
      setPaths(list);
    } catch (e) {
      setError(e.message || "Erreur de chargement");
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadData();
      setLoading(false);
    })();
  }, []);

  const onToggleFavorite = async (path) => {
    const snapshot = paths;
    setPaths((prev) =>
      prev.map((p) => (p.id === path.id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
    try {
      await toggleFavorite(path.id);
    } catch {
      setPaths(snapshot);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-amber-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-6">
      <h1 className="text-3xl font-extrabold text-slate-900">Mes chemins</h1>
      <p className="mt-1 text-slate-600">Gérez vos trajets publiés.</p>

      {error && <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-red-700">{error}</div>}

      {visiblePaths.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Aucun chemin trouvé</h2>
          <p className="mt-2 text-slate-600">Créez un chemin depuis l’app mobile.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-3">
          {visiblePaths.map((path) => (
            <article
              key={path.id || path.share_token}
              className="grid grid-cols-[96px_1fr_auto] items-center gap-3 rounded-2xl bg-white p-3 shadow-sm"
            >
              <button onClick={() => openPath(path)} className="h-24 w-24 overflow-hidden rounded-xl">
                <img
                  // src={path.thumbnail || "https://picsum.photos/300/300"}
                  src={path.thumbnail || "/placeholder-path.png"}
                  alt={path.title || "Chemin"}
                  className="h-full w-full object-cover"
                />
              </button>

              <button onClick={() => openPath(path)} className="text-left">
                <p className="line-clamp-2 font-semibold text-slate-900">
                  {path.title || "Chemin sans titre"}
                </p>
                <p className="text-sm text-slate-600">
                  {path.duration || "-"} • {path.destination || path.end_label || "-"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Statut: {path.status || "published"}
                </p>
              </button>

              <button
                onClick={() => onToggleFavorite(path)}
                className={`px-2 text-2xl ${path.isFavorite ? "text-red-500" : "text-slate-300"}`}
                aria-label="Favori"
              >
                {path.isFavorite ? "♥" : "♡"}
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
