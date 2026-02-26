

// import { useEffect, useMemo, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   IoNotificationsOutline,
//   IoRefresh,
//   IoHeart,
//   IoHeartOutline,
//   IoPlay,
//   IoTimeOutline,
//   IoMapOutline,
// } from "react-icons/io5";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "https://tektal-backend.onrender.com";

// async function parseJsonSafe(res) {
//   const text = await res.text();
//   try {
//     return JSON.parse(text);
//   } catch {
//     throw new Error(`Reponse non JSON (${res.status}) depuis ${res.url}`);
//   }
// }

// export default function Accueil() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState("");
//   const [userName, setUserName] = useState("Utilisateur");
//   const [paths, setPaths] = useState([]);

//   const featured = useMemo(() => paths.slice(0, 5), [paths]);

//   async function loadData() {
//     const access = localStorage.getItem("access");
//     const headers = {
//       Accept: "application/json",
//       ...(access ? { Authorization: `Bearer ${access}` } : {}),
//     };

//     const [meRes, pathsRes] = await Promise.all([
//       fetch(`${API_BASE_URL}/api/me/`, { headers }),
//       fetch(`${API_BASE_URL}/api/paths/`, { headers }),
//     ]);

//     const meBody = await parseJsonSafe(meRes);
//     const pathsBody = await parseJsonSafe(pathsRes);

//     if (!meRes.ok) throw new Error(meBody?.message || meBody?.detail || "Erreur profil");
//     if (!pathsRes.ok) throw new Error(pathsBody?.message || pathsBody?.detail || "Erreur chemins");

//     const user = meBody?.data || meBody || {};
//     const name =
//       user.name ||
//       user.full_name ||
//       (user.email ? user.email.split("@")[0] : "Utilisateur");

//     const raw =
//       pathsBody?.data?.results ||
//       pathsBody?.data ||
//       pathsBody?.results ||
//       pathsBody ||
//       [];

//     setUserName(name);
//     setPaths(Array.isArray(raw) ? raw : []);
//   }

//   useEffect(() => {
//     let mounted = true;
//     (async () => {
//       setLoading(true);
//       setError("");
//       try {
//         await loadData();
//       } catch (e) {
//         if (mounted) setError(e.message || "Erreur de chargement");
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     })();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   async function onRefresh() {
//     setRefreshing(true);
//     setError("");
//     try {
//       await loadData();
//     } catch (e) {
//       setError(e.message || "Erreur de rafraichissement");
//     } finally {
//       setRefreshing(false);
//     }
//   }

//   function openPath(path) {
//     const token = path.share_token || path.id;
//     navigate(`/share/${encodeURIComponent(token)}`);
//   }

//   async function toggleFavorite(path) {
//     const access = localStorage.getItem("access");
//     const headers = {
//       "Content-Type": "application/json",
//       ...(access ? { Authorization: `Bearer ${access}` } : {}),
//     };

//     setPaths((prev) =>
//       prev.map((p) => (p.id === path.id ? { ...p, isFavorite: !p.isFavorite } : p))
//     );

//     try {
//       await fetch(`${API_BASE_URL}/api/paths/${path.id}/favorite/`, {
//         method: "POST",
//         headers,
//       });
//     } catch {
//       setPaths((prev) =>
//         prev.map((p) => (p.id === path.id ? { ...p, isFavorite: !p.isFavorite } : p))
//       );
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-[320px] grid place-items-center text-gray-600">
//         <div className="h-9 w-9 rounded-full border-4 border-gray-200 border-t-amber-400 animate-spin mb-3" />
//         <p>Chargement des chemins...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-full bg-slate-50 pb-6">
//       <header className="bg-gradient-to-br from-amber-300 to-amber-500 text-white px-5 py-6 rounded-b-2xl flex items-center justify-between">
//         <div>
//           <p className="opacity-90 mb-1">Bonjour</p>
//           <h1 className="text-3xl font-bold leading-tight">{userName}</h1>
//         </div>
//         <button
//           className="relative h-11 w-11 rounded-full bg-white/20 grid place-items-center"
//           type="button"
//           aria-label="Notifications"
//         >
//           <IoNotificationsOutline size={20} />
//           {paths.length > 0 && (
//             <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 text-[10px] px-1 grid place-items-center font-semibold">
//               {paths.length}
//             </span>
//           )}
//         </button>
//       </header>

//       {error && (
//         <div className="mx-5 mt-4 bg-red-50 text-red-700 rounded-lg px-3 py-2 text-sm">
//           {error}
//         </div>
//       )}

//       {paths.length === 0 ? (
//         <section className="mx-5 mt-7 bg-white rounded-2xl p-7 text-center shadow-sm">
//           <div className="grid place-items-center mb-3 text-amber-500">
//             <IoMapOutline size={58} />
//           </div>
//           <h2 className="text-xl font-bold text-slate-900 mb-2">Aucun chemin pour le moment</h2>
//           <p className="text-slate-600 mb-5">
//             Explorez de nouveaux horizons en creant votre premier chemin.
//           </p>
//           <Link
//             className="inline-flex items-center rounded-full bg-gradient-to-r from-amber-300 to-amber-500 text-white font-semibold px-5 py-3"
//             to="/app?tab=ajouter"
//           >
//             Creer un chemin
//           </Link>
//         </section>
//       ) : (
//         <>
//           <section className="mt-6">
//             <div className="px-5 mb-3">
//               <h2 className="text-2xl font-bold text-slate-900">Derniers chemins</h2>
//             </div>

//             <div className="flex gap-3 overflow-x-auto px-5 pb-1 snap-x snap-mandatory">
//               {featured.map((path) => (
//                 <button
//                   key={path.id || path.share_token}
//                   className="relative min-w-[320px] h-[200px] rounded-2xl overflow-hidden snap-start"
//                   onClick={() => openPath(path)}
//                   type="button"
//                 >
//                   <img
//                     src={path.thumbnail || "https://picsum.photos/800/500"}
//                     alt={path.title || "Chemin"}
//                     className="h-full w-full object-cover"
//                   />
//                   <div className="absolute inset-x-0 bottom-0 p-4 text-white bg-gradient-to-t from-black/80 to-transparent text-left">
//                     <h3 className="font-bold text-base line-clamp-2">
//                       {path.title || "Chemin sans titre"}
//                     </h3>
//                     <p className="text-sm opacity-95 line-clamp-1">
//                       Par {path.creator || path.user_name || "Utilisateur"}
//                     </p>
//                     <div className="mt-1 text-xs inline-flex items-center gap-1">
//                       <IoTimeOutline size={13} />
//                       {path.duration || "-"}
//                     </div>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </section>

//           <section className="mt-6">
//             <div className="px-5 mb-3 flex items-center justify-between">
//               <h2 className="text-2xl font-bold text-slate-900">Tous les chemins</h2>
//               <button
//                 className="h-9 w-9 rounded-full bg-amber-100 text-amber-700 grid place-items-center"
//                 onClick={onRefresh}
//                 type="button"
//                 aria-label="Rafraichir"
//               >
//                 {refreshing ? "..." : <IoRefresh size={18} />}
//               </button>
//             </div>

//             <div className="px-5 grid gap-3">
//               {paths.map((path) => (
//                 <article
//                   key={path.id || path.share_token}
//                   className="bg-white rounded-2xl p-3 grid grid-cols-[96px_1fr_auto] gap-3 items-center shadow-sm"
//                 >
//                   <button
//                     className="relative h-24 w-24 rounded-xl overflow-hidden"
//                     onClick={() => openPath(path)}
//                     type="button"
//                   >
//                     <img
//                       src={path.thumbnail || "https://picsum.photos/300/300"}
//                       alt={path.title || "Chemin"}
//                       className="h-full w-full object-cover"
//                     />
//                     <span className="absolute bottom-1.5 right-1.5 h-7 w-7 rounded-full bg-amber-500/95 text-white grid place-items-center">
//                       <IoPlay size={14} />
//                     </span>
//                   </button>

//                   <button className="text-left" onClick={() => openPath(path)} type="button">
//                     <h3 className="font-semibold text-slate-900 line-clamp-2">
//                       {path.title || "Chemin sans titre"}
//                     </h3>
//                     <p className="text-sm text-slate-600 line-clamp-1">
//                       Par {path.creator || path.user_name || "Utilisateur"}
//                     </p>
//                     <small className="mt-1 inline-flex items-center gap-1 text-slate-500">
//                       <IoTimeOutline size={12} />
//                       {path.duration || "-"}
//                     </small>
//                   </button>

//                   <button
//                     className={`p-2 ${path.isFavorite ? "text-red-500" : "text-slate-300"}`}
//                     onClick={() => toggleFavorite(path)}
//                     type="button"
//                     aria-label="Favori"
//                   >
//                     {path.isFavorite ? <IoHeart size={22} /> : <IoHeartOutline size={22} />}
//                   </button>
//                 </article>
//               ))}
//             </div>
//           </section>
//         </>
//       )}
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../services/authService";
import { getPaths, toggleFavorite } from "../../services/pathService";

export default function Accueil() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("Utilisateur");
  const [paths, setPaths] = useState([]);

  const featured = useMemo(() => paths.slice(0, 5), [paths]);

  const openPath = (path) => {
    const token = path.share_token || path.id;
    navigate(`/share/${encodeURIComponent(token)}`);
  };

  const normalizeList = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.results)) return payload.results;
    if (Array.isArray(payload?.data?.results)) return payload.data.results;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
  };

  const loadData = async () => {
    setError("");
    try {
      const [meRes, pathsRes] = await Promise.all([getProfile(), getPaths()]);
      if (!meRes?.ok) throw new Error(meRes?.data?.detail || "Erreur profil");

      const me = meRes.data || {};
      setUserName(me.name || me.full_name || me.first_name || me.email || "Utilisateur");

      setPaths(normalizeList(pathsRes));
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

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

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
    <div className="min-h-screen bg-slate-50">
      <header className="rounded-b-3xl bg-gradient-to-br from-amber-300 to-amber-500 px-6 py-8 text-white">
        <p className="text-sm opacity-90">Bonjour</p>
        <h1 className="text-3xl font-extrabold">{userName}</h1>
      </header>

      {error && <div className="mx-6 mt-4 rounded-xl bg-red-50 px-4 py-3 text-red-700">{error}</div>}

      {paths.length === 0 ? (
        <section className="mx-6 mt-8 rounded-2xl bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Aucun chemin pour le moment</h2>
          <p className="mt-2 text-slate-600">Créez votre premier chemin.</p>
          <button
            onClick={() => navigate("/mes-chemins")}
            className="mt-5 rounded-xl bg-amber-400 px-5 py-3 font-semibold text-slate-900"
          >
            Voir mes chemins
          </button>
        </section>
      ) : (
        <>
          <section className="mt-6">
            <div className="mb-3 px-6">
              <h2 className="text-2xl font-bold text-slate-900">Derniers chemins</h2>
            </div>
            <div className="flex snap-x gap-3 overflow-x-auto px-6 pb-2">
              {featured.map((path) => (
                <button
                  key={path.id || path.share_token}
                  onClick={() => openPath(path)}
                  className="relative h-48 min-w-[300px] snap-start overflow-hidden rounded-2xl"
                >
                  <img
                    src={path.thumbnail || "https://picsum.photos/800/500"}
                    alt={path.title || "Chemin"}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-left text-white">
                    <p className="line-clamp-2 font-bold">{path.title || "Chemin sans titre"}</p>
                    <p className="text-sm opacity-90">{path.duration || "-"}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-8 px-6 pb-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Tous les chemins</h2>
              <button
                onClick={onRefresh}
                className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700"
              >
                {refreshing ? "..." : "Rafraîchir"}
              </button>
            </div>

            <div className="grid gap-3">
              {paths.map((path) => (
                <article
                  key={path.id || path.share_token}
                  className="grid grid-cols-[92px_1fr_auto] items-center gap-3 rounded-2xl bg-white p-3 shadow-sm"
                >
                  <button onClick={() => openPath(path)} className="h-24 w-24 overflow-hidden rounded-xl">
                    <img
                      src={path.thumbnail || "https://picsum.photos/300/300"}
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
          </section>
        </>
      )}
    </div>
  );
}
