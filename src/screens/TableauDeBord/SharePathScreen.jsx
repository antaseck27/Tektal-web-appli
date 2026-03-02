



// import { useEffect, useMemo, useRef, useState } from "react";
// import { useParams } from "react-router-dom";
// import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
// import L from "leaflet";
// import {
//   Eye,
//   EyeOff,
//   Map,
//   Download,
//   Clock3,
//   Route,
//   UserRound,
//   PlayCircle,
//   ChevronDown,
//   ChevronUp,
//   Moon,
//   Sun,
// } from "lucide-react";
// import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";
// import { getSharedPath } from "../../services/pathService";
// import { APP_DOWNLOAD_URL } from "../../config/api";
// import logoTektal from "../../assets/logo-tektal.png";

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });

// function FitRoute({ points }) {
//   const map = useMap();
//   useEffect(() => {
//     if (!points?.length) return;
//     map.fitBounds(L.latLngBounds(points), { padding: [24, 24] });
//   }, [map, points]);
//   return null;
// }

// const startIcon = L.divIcon({
//   html: `<div style="width:16px;height:16px;border-radius:999px;background:#22c55e;border:3px solid #fff;"></div>`,
//   className: "",
//   iconSize: [16, 16],
//   iconAnchor: [8, 8],
// });

// const endIcon = L.divIcon({
//   html: `<div style="width:16px;height:16px;border-radius:999px;background:#ef4444;border:3px solid #fff;"></div>`,
//   className: "",
//   iconSize: [16, 16],
//   iconAnchor: [8, 8],
// });

// export default function SharePathScreen() {
//   const { share_token } = useParams();

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [path, setPath] = useState(null);
//   const [stepsOpen, setStepsOpen] = useState(true);
//   const [mapVisible, setMapVisible] = useState(false);
//   const [isDark, setIsDark] = useState(() => {
//     const saved = localStorage.getItem("tektal-theme");
//     if (saved) return saved === "dark";
//     return window.matchMedia("(prefers-color-scheme: dark)").matches;
//   });

//   const mapRef = useRef(null);

//   useEffect(() => {
//     document.documentElement.classList.toggle("dark", isDark);
//     localStorage.setItem("tektal-theme", isDark ? "dark" : "light");
//   }, [isDark]);

//   const handleToggleMap = () => {
//     setMapVisible((v) => {
//       const next = !v;
//       if (next) {
//         setTimeout(() => {
//           mapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//         }, 60);
//       }
//       return next;
//     });
//   };

//   useEffect(() => {
//     let mounted = true;

//     async function loadPath() {
//       setLoading(true);
//       setError("");
//       try {
//         const res = await getSharedPath(share_token);
//         const data = res?.ok === false ? null : res?.data ?? res;
//         if (!data) throw new Error(res?.message || "Chemin introuvable.");
//         if (mounted) setPath(data);
//       } catch (e) {
//         if (mounted) setError(e?.message || "Lien invalide ou chemin introuvable.");
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     }

//     if (share_token) loadPath();
//     else {
//       setError("Token de partage manquant.");
//       setLoading(false);
//     }

//     return () => {
//       mounted = false;
//     };
//   }, [share_token]);

//   const steps = useMemo(() => {
//     const raw = Array.isArray(path?.steps) ? path.steps : [];
//     return [...raw].sort(
//       (a, b) => (a.step_number ?? a.order ?? 0) - (b.step_number ?? b.order ?? 0)
//     );
//   }, [path]);

//   const mapPoints = useMemo(() => {
//     const src =
//       (Array.isArray(path?.gps_points) && path.gps_points) ||
//       (Array.isArray(path?.coordinates) && path.coordinates) ||
//       [];

//     if (src.length) {
//       return src
//         .map((p) => {
//           const lat = Number(p.latitude ?? p.lat);
//           const lng = Number(p.longitude ?? p.lng);
//           if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
//           return [lat, lng];
//         })
//         .filter(Boolean);
//     }

//     const sLat = Number(path?.start_lat);
//     const sLng = Number(path?.start_lng);
//     const eLat = Number(path?.end_lat);
//     const eLng = Number(path?.end_lng);

//     if ([sLat, sLng, eLat, eLng].every(Number.isFinite)) {
//       return [
//         [sLat, sLng],
//         [eLat, eLng],
//       ];
//     }

//     return [];
//   }, [path]);

//   const formatDuration = (seconds) => {
//     if (!seconds && seconds !== 0) return "-";
//     const m = Math.floor(seconds / 60);
//     const s = seconds % 60;
//     return m ? `${m} min ${s ? `${s}s` : ""}` : `${s}s`;
//   };

//   const formatTime = (seconds) => {
//     if (!seconds && seconds !== 0) return "0:00";
//     const m = Math.floor(seconds / 60);
//     const s = Math.floor(seconds % 60);
//     return `${m}:${String(s).padStart(2, "0")}`;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-slate-50 dark:bg-slate-950 grid place-items-center">
//         <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-amber-400" />
//       </div>
//     );
//   }

//   if (error || !path) {
//     return (
//       <div className="min-h-screen bg-slate-50 dark:bg-slate-950 grid place-items-center px-6">
//         <div className="w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 text-center shadow-sm">
//           <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chemin introuvable</h2>
//           <p className="mt-2 text-slate-600 dark:text-slate-300">{error || "Ce lien n'est pas valide."}</p>
//           <a
//             className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-semibold text-slate-900 hover:bg-amber-300"
//             href={APP_DOWNLOAD_URL}
//             target="_blank"
//             rel="noreferrer"
//           >
//             <Download size={16} />
//             Télécharger l'application
//           </a>
//         </div>
//       </div>
//     );
//   }

//   const title = path.title || "Chemin partagé";
//   const videoUrl = path.video_url || path.videoUrl || "";
//   const startLabel = path.start_label || path.departure || "-";
//   const endLabel = path.end_label || path.destination || "-";
//   const creator = path.creator || path.user_name || "Utilisateur";
//   const gpsCount = path?.gps_points?.length || mapPoints.length || 0;

//   return (
//     <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
//       <div className="pointer-events-none fixed inset-x-0 top-0 h-72 bg-gradient-to-b from-sky-100/50 dark:from-slate-800/40 to-transparent" />

//       <header className="sticky top-0 z-[1000] border-b border-slate-200/90 dark:border-slate-700/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
//         <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
//           <div className="flex items-center gap-3">
//             <img
//               src={logoTektal}
//               alt="TEKTAL"
//               className="h-10 w-10 rounded-xl object-cover ring-2 ring-amber-300/70 shadow-sm"
//             />
//             <div>
//               <h1 className="text-xl font-black tracking-tight">TEKTAL</h1>
//               <p className="text-xs text-slate-500 dark:text-slate-400">Chemin partagé, étape par étape</p>
//             </div>
//           </div>

//           <div className="flex w-full items-center gap-2 sm:w-auto">
//             <button
//               onClick={() => setIsDark((v) => !v)}
//               className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
//             >
//               {isDark ? <Sun size={16} /> : <Moon size={16} />}
//             </button>

//             <button
//               onClick={handleToggleMap}
//               className={`flex-1 sm:flex-none rounded-xl border px-4 py-2 text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-sm transition ${
//                 mapVisible
//                   ? "border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:border-sky-700 dark:bg-sky-900/30 dark:text-sky-300 dark:hover:bg-sky-900/50"
//                   : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
//               }`}
//             >
//               {mapVisible ? <EyeOff size={15} /> : <Eye size={15} />}
//               {mapVisible ? "Masquer la carte" : "Voir la carte"}
//             </button>

//             <a
//               href={APP_DOWNLOAD_URL}
//               target="_blank"
//               rel="noreferrer"
//               className="flex-1 sm:flex-none rounded-xl bg-amber-400 px-4 py-2 text-center text-sm font-bold text-slate-900 hover:bg-amber-300"
//             >
//               Télécharger l'app
//             </a>
//           </div>
//         </div>
//       </header>

//       <main className="relative mx-auto max-w-7xl px-4 py-4 sm:px-5 sm:py-5">
//         <section className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm sm:p-6">
//           <h2 className="text-2xl font-black leading-tight sm:text-3xl">{title}</h2>
//           <p className="mt-1 text-slate-600 dark:text-slate-300">{startLabel} → {endLabel}</p>

//           <div className="mt-4 flex flex-wrap gap-2">
//             <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1 text-xs font-medium">
//               <Clock3 size={13} className="text-slate-500 dark:text-slate-400" />
//               {formatDuration(path.duration)}
//             </span>
//             <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1 text-xs font-medium">
//               <Route size={13} className="text-slate-500 dark:text-slate-400" />
//               {gpsCount} points
//             </span>
//             <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1 text-xs font-medium">
//               <UserRound size={13} className="text-slate-500 dark:text-slate-400" />
//               {creator}
//             </span>
//           </div>
//         </section>

//         <div className="mt-4 grid gap-4 lg:grid-cols-[1.55fr_1fr]">
//           <section className="space-y-4">
//             {mapVisible && (
//               <div
//                 ref={mapRef}
//                 className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm scroll-mt-24"
//               >
//                 <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-4 py-3">
//                   <div className="inline-flex items-center gap-2">
//                     <Map size={16} className="text-sky-600 dark:text-sky-400" />
//                     <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Carte du trajet</span>
//                   </div>
//                   <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
//                     {gpsCount} points GPS
//                   </span>
//                 </div>

//                 {mapPoints.length > 0 ? (
//                   <div className="relative">
//                     <MapContainer className="h-[340px] w-full sm:h-[430px] lg:h-[520px]" center={mapPoints[0]} zoom={15}>
//                       <TileLayer
//                         attribution="&copy; OpenStreetMap"
//                         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                       />
//                       <FitRoute points={mapPoints} />
//                       <Polyline positions={mapPoints} color="#0ea5e9" weight={5} opacity={0.9} />
//                       <Marker position={mapPoints[0]} icon={startIcon} />
//                       <Marker position={mapPoints[mapPoints.length - 1]} icon={endIcon} />
//                     </MapContainer>

//                     <div className="pointer-events-none absolute left-3 top-3 rounded-lg bg-white/95 dark:bg-slate-900/95 px-3 py-2 shadow">
//                       <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">DÉPART</p>
//                       <p className="max-w-[180px] truncate text-xs font-semibold text-slate-700 dark:text-slate-200">{startLabel}</p>
//                     </div>

//                     <div className="pointer-events-none absolute bottom-3 right-3 rounded-lg bg-white/95 dark:bg-slate-900/95 px-3 py-2 shadow">
//                       <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">ARRIVÉE</p>
//                       <p className="max-w-[180px] truncate text-xs font-semibold text-slate-700 dark:text-slate-200">{endLabel}</p>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="grid h-[340px] place-items-center text-slate-500 dark:text-slate-400 sm:h-[430px]">
//                     Carte indisponible
//                   </div>
//                 )}
//               </div>
//             )}

//             <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 shadow-sm sm:p-4">
//               <h3 className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
//                 <PlayCircle size={16} className="text-slate-500 dark:text-slate-400" />
//                 Vidéo du trajet
//               </h3>
//               {videoUrl ? (
//                 <video controls className="w-full max-h-[270px] rounded-2xl object-contain bg-black sm:max-h-[360px]">
//                   <source src={videoUrl} />
//                   Votre navigateur ne supporte pas la lecture vidéo.
//                 </video>
//               ) : (
//                 <p className="text-slate-500 dark:text-slate-400">Vidéo non disponible.</p>
//               )}
//             </div>
//           </section>

//           <aside className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 shadow-sm sm:p-4 lg:sticky lg:top-24 lg:h-fit">
//             <div className="mb-3 flex items-center justify-between">
//               <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Instructions</h3>
//               <button
//                 onClick={() => setStepsOpen((v) => !v)}
//                 className="inline-flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
//               >
//                 {stepsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//                 {stepsOpen ? "Masquer" : "Afficher"} ({steps.length})
//               </button>
//             </div>

//             {stepsOpen &&
//               (steps.length === 0 ? (
//                 <p className="text-slate-500 dark:text-slate-400">Aucune étape fournie.</p>
//               ) : (
//                 <div className="max-h-[640px] space-y-2 overflow-y-auto pr-1">
//                   {steps.map((step, idx) => {
//                     const n = step.step_number ?? idx + 1;
//                     return (
//                       <article
//                         key={step.id || idx}
//                         className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/60 p-3"
//                       >
//                         <div className="mb-1 flex items-center justify-between">
//                           <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Étape {n}</span>
//                           <span className="text-[11px] text-slate-500 dark:text-slate-400">
//                             {formatTime(step.start_time)} → {formatTime(step.end_time)}
//                           </span>
//                         </div>
//                         <p className="text-sm leading-5 text-slate-700 dark:text-slate-200">
//                           {step.text || step.instruction || step.description || "-"}
//                         </p>
//                       </article>
//                     );
//                   })}
//                 </div>
//               ))}
//           </aside>
//         </div>
//       </main>
//     </div>
//   );
// }


import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import {
  Eye,
  EyeOff,
  Map,
  Download,
  Clock3,
  Route,
  UserRound,
  PlayCircle,
  ChevronDown,
  ChevronUp,
  Moon,
  Sun,
} from "lucide-react";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { getSharedPath } from "../../services/pathService";
import { APP_DOWNLOAD_URL } from "../../config/api";
import logoTektal from "../../assets/logo-tektal.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function FitRoute({ points }) {
  const map = useMap();
  useEffect(() => {
    if (!points?.length) return;
    map.fitBounds(L.latLngBounds(points), { padding: [24, 24] });
  }, [map, points]);
  return null;
}

const startIcon = L.divIcon({
  html: `<div style="width:16px;height:16px;border-radius:999px;background:#22c55e;border:3px solid #fff;"></div>`,
  className: "",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const endIcon = L.divIcon({
  html: `<div style="width:16px;height:16px;border-radius:999px;background:#ef4444;border:3px solid #fff;"></div>`,
  className: "",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export default function SharePathScreen() {
  const { share_token } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [path, setPath] = useState(null);
  const [stepsOpen, setStepsOpen] = useState(true);
  const [mapVisible, setMapVisible] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("tektal-theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const mapRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("tektal-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const handleToggleMap = () => {
    setMapVisible((v) => {
      const next = !v;
      if (next) {
        setTimeout(() => {
          mapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 60);
      }
      return next;
    });
  };

  useEffect(() => {
    let mounted = true;

    async function loadPath() {
      setLoading(true);
      setError("");
      try {
        const res = await getSharedPath(share_token);
        const data = res?.ok === false ? null : res?.data ?? res;
        if (!data) throw new Error(res?.message || "Chemin introuvable.");
        if (mounted) setPath(data);
      } catch (e) {
        if (mounted) setError(e?.message || "Lien invalide ou chemin introuvable.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (share_token) loadPath();
    else {
      setError("Token de partage manquant.");
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [share_token]);

  const steps = useMemo(() => {
    const raw = Array.isArray(path?.steps) ? path.steps : [];
    return [...raw].sort(
      (a, b) => (a.step_number ?? a.order ?? 0) - (b.step_number ?? b.order ?? 0)
    );
  }, [path]);

  const mapPoints = useMemo(() => {
    const src =
      (Array.isArray(path?.gps_points) && path.gps_points) ||
      (Array.isArray(path?.coordinates) && path.coordinates) ||
      [];

    if (src.length) {
      return src
        .map((p) => {
          const lat = Number(p.latitude ?? p.lat);
          const lng = Number(p.longitude ?? p.lng);
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
          return [lat, lng];
        })
        .filter(Boolean);
    }

    const sLat = Number(path?.start_lat);
    const sLng = Number(path?.start_lng);
    const eLat = Number(path?.end_lat);
    const eLng = Number(path?.end_lng);

    if ([sLat, sLng, eLat, eLng].every(Number.isFinite)) {
      return [
        [sLat, sLng],
        [eLat, eLng],
      ];
    }

    return [];
  }, [path]);

  const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return "-";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m ? `${m} min ${s ? `${s}s` : ""}` : `${s}s`;
  };

  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 grid place-items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-amber-400" />
      </div>
    );
  }

  if (error || !path) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 grid place-items-center px-6">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Chemin introuvable</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">{error || "Ce lien n'est pas valide."}</p>
          <a
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-semibold text-slate-900 hover:bg-amber-300"
            href={APP_DOWNLOAD_URL}
            target="_blank"
            rel="noreferrer"
          >
            <Download size={16} />
            Télécharger l'application
          </a>
        </div>
      </div>
    );
  }

  const title = path.title || "Chemin partagé";
  const videoUrl = path.video_url || path.videoUrl || "";
  const startLabel = path.start_label || path.departure || "-";
  const endLabel = path.end_label || path.destination || "-";
  const creator = path.creator || path.user_name || "Utilisateur";
  const gpsCount = path?.gps_points?.length || mapPoints.length || 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-72 bg-gradient-to-b from-sky-100/50 dark:from-slate-800/40 to-transparent" />

      <header className="sticky top-0 z-[1000] border-b border-slate-200/90 dark:border-slate-700/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <img
              src={logoTektal}
              alt="TEKTAL"
              className="h-10 w-10 rounded-xl object-cover ring-2 ring-amber-300/70 shadow-sm"
            />
            <div>
              <h1 className="text-xl font-black tracking-tight">TEKTAL</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Chemin partagé, étape par étape</p>
            </div>
          </div>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            <button
              onClick={() => setIsDark((v) => !v)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              onClick={handleToggleMap}
              className={`flex-1 sm:flex-none rounded-xl border px-4 py-2 text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-sm transition ${
                mapVisible
                  ? "border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 dark:border-sky-700 dark:bg-sky-900/30 dark:text-sky-300 dark:hover:bg-sky-900/50"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              {mapVisible ? <EyeOff size={15} /> : <Eye size={15} />}
              {mapVisible ? "Masquer la carte" : "Voir la carte"}
            </button>

            <a
              href={APP_DOWNLOAD_URL}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none rounded-xl bg-amber-400 px-4 py-2 text-center text-sm font-bold text-slate-900 hover:bg-amber-300"
            >
              Télécharger l'app
            </a>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-7xl px-4 py-4 sm:px-5 sm:py-5">
        <section className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm sm:p-6">
          <h2 className="text-2xl font-black leading-tight sm:text-3xl">{title}</h2>
          <p className="mt-1 text-slate-600 dark:text-slate-300">{startLabel} → {endLabel}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1 text-xs font-medium">
              <Clock3 size={13} className="text-slate-500 dark:text-slate-400" />
              {formatDuration(path.duration)}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1 text-xs font-medium">
              <Route size={13} className="text-slate-500 dark:text-slate-400" />
              {gpsCount} points
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1 text-xs font-medium">
              <UserRound size={13} className="text-slate-500 dark:text-slate-400" />
              {creator}
            </span>
          </div>
        </section>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.55fr_1fr]">
          <section className="space-y-4">
            {mapVisible && (
              <div
                ref={mapRef}
                className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm scroll-mt-24"
              >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-4 py-3">
                  <div className="inline-flex items-center gap-2">
                    <Map size={16} className="text-sky-600 dark:text-sky-400" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Carte du trajet</span>
                  </div>
                  <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    {gpsCount} points GPS
                  </span>
                </div>

                {mapPoints.length > 0 ? (
                  <div className="relative">
                    <MapContainer className="h-[340px] w-full sm:h-[430px] lg:h-[520px]" center={mapPoints[0]} zoom={15}>
                      <TileLayer
                        attribution={isDark ? "&copy; OpenStreetMap &copy; CARTO" : "&copy; OpenStreetMap"}
                        url={
                          isDark
                            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        }
                      />
                      <FitRoute points={mapPoints} />
                      <Polyline positions={mapPoints} color="#0ea5e9" weight={5} opacity={0.9} />
                      <Marker position={mapPoints[0]} icon={startIcon} />
                      <Marker position={mapPoints[mapPoints.length - 1]} icon={endIcon} />
                    </MapContainer>

                    <div className="pointer-events-none absolute left-3 top-3 rounded-lg bg-white/95 dark:bg-slate-900/95 px-3 py-2 shadow">
                      <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">DÉPART</p>
                      <p className="max-w-[180px] truncate text-xs font-semibold text-slate-700 dark:text-slate-200">{startLabel}</p>
                    </div>

                    <div className="pointer-events-none absolute bottom-3 right-3 rounded-lg bg-white/95 dark:bg-slate-900/95 px-3 py-2 shadow">
                      <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400">ARRIVÉE</p>
                      <p className="max-w-[180px] truncate text-xs font-semibold text-slate-700 dark:text-slate-200">{endLabel}</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid h-[340px] place-items-center text-slate-500 dark:text-slate-400 sm:h-[430px]">
                    Carte indisponible
                  </div>
                )}
              </div>
            )}

            <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 shadow-sm sm:p-4">
              <h3 className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <PlayCircle size={16} className="text-slate-500 dark:text-slate-400" />
                Vidéo du trajet
              </h3>
              {videoUrl ? (
                <video controls className="w-full max-h-[270px] rounded-2xl object-contain bg-black sm:max-h-[360px]">
                  <source src={videoUrl} />
                  Votre navigateur ne supporte pas la lecture vidéo.
                </video>
              ) : (
                <p className="text-slate-500 dark:text-slate-400">Vidéo non disponible.</p>
              )}
            </div>
          </section>

          <aside className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 shadow-sm sm:p-4 lg:sticky lg:top-24 lg:h-fit">
            {/* Mini carte desktop visible quand la grande carte est cachée */}
            {!mapVisible && mapPoints.length > 0 && (
              <div className="hidden lg:block mb-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-3 py-2">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Mini carte</span>
                  <button
                    onClick={handleToggleMap}
                    className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    Agrandir
                  </button>
                </div>

                <MapContainer
                  className="h-[180px] w-full"
                  center={mapPoints[0]}
                  zoom={14}
                  zoomControl={false}
                  dragging={false}
                  doubleClickZoom={false}
                  scrollWheelZoom={false}
                  touchZoom={false}
                  boxZoom={false}
                  keyboard={false}
                >
                  <TileLayer
                    attribution={isDark ? "&copy; OpenStreetMap &copy; CARTO" : "&copy; OpenStreetMap"}
                    url={
                      isDark
                        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    }
                  />
                  <FitRoute points={mapPoints} />
                  <Polyline positions={mapPoints} color="#0ea5e9" weight={4} opacity={0.85} />
                  <Marker position={mapPoints[0]} icon={startIcon} />
                  <Marker position={mapPoints[mapPoints.length - 1]} icon={endIcon} />
                </MapContainer>
              </div>
            )}

            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Instructions</h3>
              <button
                onClick={() => setStepsOpen((v) => !v)}
                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                {stepsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {stepsOpen ? "Masquer" : "Afficher"} ({steps.length})
              </button>
            </div>

            {stepsOpen &&
              (steps.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400">Aucune étape fournie.</p>
              ) : (
                <div className="max-h-[640px] space-y-2 overflow-y-auto pr-1">
                  {steps.map((step, idx) => {
                    const n = step.step_number ?? idx + 1;
                    return (
                      <article
                        key={step.id || idx}
                        className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/60 p-3"
                      >
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Étape {n}</span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {formatTime(step.start_time)} → {formatTime(step.end_time)}
                          </span>
                        </div>
                        <p className="text-sm leading-5 text-slate-700 dark:text-slate-200">
                          {step.text || step.instruction || step.description || "-"}
                        </p>
                      </article>
                    );
                  })}
                </div>
              ))}
          </aside>
        </div>
      </main>
    </div>
  );
}







// import { useEffect, useMemo, useRef, useState } from "react";
// import { useParams } from "react-router-dom";
// import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
// import L from "leaflet";
// import {
//   Eye,
//   EyeOff,
//   Map,
//   Download,
//   Clock3,
//   Route,
//   UserRound,
//   PlayCircle,
//   ChevronDown,
//   ChevronUp,
// } from "lucide-react";
// import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";
// import { getSharedPath } from "../../services/pathService";
// import { APP_DOWNLOAD_URL } from "../../config/api";
// import logoTektal from "../../assets/logo-tektal.png";

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });

// function FitRoute({ points }) {
//   const map = useMap();
//   useEffect(() => {
//     if (!points?.length) return;
//     map.fitBounds(L.latLngBounds(points), { padding: [24, 24] });
//   }, [map, points]);
//   return null;
// }

// const startIcon = L.divIcon({
//   html: `<div style="width:16px;height:16px;border-radius:999px;background:#22c55e;border:3px solid #fff;"></div>`,
//   className: "",
//   iconSize: [16, 16],
//   iconAnchor: [8, 8],
// });

// const endIcon = L.divIcon({
//   html: `<div style="width:16px;height:16px;border-radius:999px;background:#ef4444;border:3px solid #fff;"></div>`,
//   className: "",
//   iconSize: [16, 16],
//   iconAnchor: [8, 8],
// });

// export default function SharePathScreen() {
//   const { share_token } = useParams();

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [path, setPath] = useState(null);
//   const [stepsOpen, setStepsOpen] = useState(true);
//   const [mapVisible, setMapVisible] = useState(false); // cachée par défaut

//   const mapRef = useRef(null);

//   const handleToggleMap = () => {
//     setMapVisible((v) => {
//       const next = !v;
//       if (next) {
//         setTimeout(() => {
//           mapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//         }, 60);
//       }
//       return next;
//     });
//   };

//   useEffect(() => {
//     let mounted = true;

//     async function loadPath() {
//       setLoading(true);
//       setError("");
//       try {
//         const res = await getSharedPath(share_token);
//         const data = res?.ok === false ? null : res?.data ?? res;
//         if (!data) throw new Error(res?.message || "Chemin introuvable.");
//         if (mounted) setPath(data);
//       } catch (e) {
//         if (mounted) setError(e?.message || "Lien invalide ou chemin introuvable.");
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     }

//     if (share_token) loadPath();
//     else {
//       setError("Token de partage manquant.");
//       setLoading(false);
//     }

//     return () => {
//       mounted = false;
//     };
//   }, [share_token]);

//   const steps = useMemo(() => {
//     const raw = Array.isArray(path?.steps) ? path.steps : [];
//     return [...raw].sort(
//       (a, b) => (a.step_number ?? a.order ?? 0) - (b.step_number ?? b.order ?? 0)
//     );
//   }, [path]);

//   const mapPoints = useMemo(() => {
//     const src =
//       (Array.isArray(path?.gps_points) && path.gps_points) ||
//       (Array.isArray(path?.coordinates) && path.coordinates) ||
//       [];

//     if (src.length) {
//       return src
//         .map((p) => {
//           const lat = Number(p.latitude ?? p.lat);
//           const lng = Number(p.longitude ?? p.lng);
//           if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
//           return [lat, lng];
//         })
//         .filter(Boolean);
//     }

//     const sLat = Number(path?.start_lat);
//     const sLng = Number(path?.start_lng);
//     const eLat = Number(path?.end_lat);
//     const eLng = Number(path?.end_lng);

//     if ([sLat, sLng, eLat, eLng].every(Number.isFinite)) {
//       return [
//         [sLat, sLng],
//         [eLat, eLng],
//       ];
//     }

//     return [];
//   }, [path]);

//   const formatDuration = (seconds) => {
//     if (!seconds && seconds !== 0) return "-";
//     const m = Math.floor(seconds / 60);
//     const s = seconds % 60;
//     return m ? `${m} min ${s ? `${s}s` : ""}` : `${s}s`;
//   };

//   const formatTime = (seconds) => {
//     if (!seconds && seconds !== 0) return "0:00";
//     const m = Math.floor(seconds / 60);
//     const s = Math.floor(seconds % 60);
//     return `${m}:${String(s).padStart(2, "0")}`;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-slate-50 grid place-items-center">
//         <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-amber-400" />
//       </div>
//     );
//   }

//   if (error || !path) {
//     return (
//       <div className="min-h-screen bg-slate-50 grid place-items-center px-6">
//         <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
//           <h2 className="text-2xl font-bold text-slate-900">Chemin introuvable</h2>
//           <p className="mt-2 text-slate-600">{error || "Ce lien n'est pas valide."}</p>
//           <a
//             className="mt-6 inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 font-semibold text-slate-900 hover:bg-amber-300"
//             href={APP_DOWNLOAD_URL}
//             target="_blank"
//             rel="noreferrer"
//           >
//             <Download size={16} />
//             Télécharger l'application
//           </a>
//         </div>
//       </div>
//     );
//   }

//   const title = path.title || "Chemin partagé";
//   const videoUrl = path.video_url || path.videoUrl || "";
//   const startLabel = path.start_label || path.departure || "-";
//   const endLabel = path.end_label || path.destination || "-";
//   const creator = path.creator || path.user_name || "Utilisateur";
//   const gpsCount = path?.gps_points?.length || mapPoints.length || 0;

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900">
//       <div className="pointer-events-none fixed inset-x-0 top-0 h-72 bg-gradient-to-b from-sky-100/50 to-transparent" />

//       <header className="sticky top-0 z-[1000] border-b border-slate-200/90 bg-white/90 backdrop-blur-xl">
//         <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
//           <div className="flex items-center gap-3">
//             <img
//               src={logoTektal}
//               alt="TEKTAL"
//               className="h-10 w-10 rounded-xl object-cover ring-2 ring-amber-300/70 shadow-sm"
//             />
//             <div>
//               <h1 className="text-xl font-black tracking-tight">TEKTAL</h1>
//               <p className="text-xs text-slate-500">Chemin partagé, étape par étape</p>
//             </div>
//           </div>

//           <div className="flex w-full items-center gap-2 sm:w-auto">
//             <button
//               onClick={handleToggleMap}
//               className={`flex-1 sm:flex-none rounded-xl border px-4 py-2 text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-sm transition ${
//                 mapVisible
//                   ? "border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100"
//                   : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
//               }`}
//             >
//               {mapVisible ? <EyeOff size={15} /> : <Eye size={15} />}
//               {mapVisible ? "Masquer la carte" : "Voir la carte"}
//             </button>

//             <a
//               href={APP_DOWNLOAD_URL}
//               target="_blank"
//               rel="noreferrer"
//               className="flex-1 sm:flex-none rounded-xl bg-amber-400 px-4 py-2 text-center text-sm font-bold text-slate-900 hover:bg-amber-300"
//             >
//               Télécharger l'app
//             </a>
//           </div>
//         </div>
//       </header>

//       <main className="relative mx-auto max-w-7xl px-4 py-4 sm:px-5 sm:py-5">
//         <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
//           <h2 className="text-2xl font-black leading-tight sm:text-3xl">{title}</h2>
//           <p className="mt-1 text-slate-600">{startLabel} → {endLabel}</p>

//           <div className="mt-4 flex flex-wrap gap-2">
//             <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium">
//               <Clock3 size={13} className="text-slate-500" />
//               {formatDuration(path.duration)}
//             </span>
//             <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium">
//               <Route size={13} className="text-slate-500" />
//               {gpsCount} points
//             </span>
//             <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium">
//               <UserRound size={13} className="text-slate-500" />
//               {creator}
//             </span>
//           </div>
//         </section>

//         <div className="mt-4 grid gap-4 lg:grid-cols-[1.55fr_1fr]">
//           <section className="space-y-4">
//             {mapVisible && (
//               <div
//                 ref={mapRef}
//                 className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm scroll-mt-24"
//               >
//                 <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
//                   <div className="inline-flex items-center gap-2">
//                     <Map size={16} className="text-sky-600" />
//                     <span className="text-sm font-semibold text-slate-700">Carte du trajet</span>
//                   </div>
//                   <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
//                     {gpsCount} points GPS
//                   </span>
//                 </div>

//                 {mapPoints.length > 0 ? (
//                   <div className="relative">
//                     <MapContainer className="h-[340px] w-full sm:h-[430px] lg:h-[520px]" center={mapPoints[0]} zoom={15}>
//                       <TileLayer
//                         attribution="&copy; OpenStreetMap"
//                         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                       />
//                       <FitRoute points={mapPoints} />
//                       <Polyline positions={mapPoints} color="#0ea5e9" weight={5} opacity={0.9} />
//                       <Marker position={mapPoints[0]} icon={startIcon} />
//                       <Marker position={mapPoints[mapPoints.length - 1]} icon={endIcon} />
//                     </MapContainer>

//                     <div className="pointer-events-none absolute left-3 top-3 rounded-lg bg-white/95 px-3 py-2 shadow">
//                       <p className="text-[11px] font-bold text-slate-500">DÉPART</p>
//                       <p className="max-w-[180px] truncate text-xs font-semibold text-slate-700">{startLabel}</p>
//                     </div>

//                     <div className="pointer-events-none absolute bottom-3 right-3 rounded-lg bg-white/95 px-3 py-2 shadow">
//                       <p className="text-[11px] font-bold text-slate-500">ARRIVÉE</p>
//                       <p className="max-w-[180px] truncate text-xs font-semibold text-slate-700">{endLabel}</p>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="grid h-[340px] place-items-center text-slate-500 sm:h-[430px]">
//                     Carte indisponible
//                   </div>
//                 )}
//               </div>
//             )}

//             <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
//               <h3 className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
//                 <PlayCircle size={16} className="text-slate-500" />
//                 Vidéo du trajet
//               </h3>
//               {videoUrl ? (
//                 <video controls className="w-full max-h-[270px] rounded-2xl object-contain bg-black sm:max-h-[360px]">
//                   <source src={videoUrl} />
//                   Votre navigateur ne supporte pas la lecture vidéo.
//                 </video>
//               ) : (
//                 <p className="text-slate-500">Vidéo non disponible.</p>
//               )}
//             </div>
//           </section>

//           <aside className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4 lg:sticky lg:top-24 lg:h-fit">
//             <div className="mb-3 flex items-center justify-between">
//               <h3 className="text-sm font-bold text-slate-800">Instructions</h3>
//               <button
//                 onClick={() => setStepsOpen((v) => !v)}
//                 className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
//               >
//                 {stepsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
//                 {stepsOpen ? "Masquer" : "Afficher"} ({steps.length})
//               </button>
//             </div>

//             {stepsOpen &&
//               (steps.length === 0 ? (
//                 <p className="text-slate-500">Aucune étape fournie.</p>
//               ) : (
//                 <div className="max-h-[640px] space-y-2 overflow-y-auto pr-1">
//                   {steps.map((step, idx) => {
//                     const n = step.step_number ?? idx + 1;
//                     return (
//                       <article
//                         key={step.id || idx}
//                         className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-3"
//                       >
//                         <div className="mb-1 flex items-center justify-between">
//                           <span className="text-xs font-bold text-amber-600">Étape {n}</span>
//                           <span className="text-[11px] text-slate-500">
//                             {formatTime(step.start_time)} → {formatTime(step.end_time)}
//                           </span>
//                         </div>
//                         <p className="text-sm leading-5 text-slate-700">
//                           {step.text || step.instruction || step.description || "-"}
//                         </p>
//                       </article>
//                     );
//                   })}
//                 </div>
//               ))}
//           </aside>
//         </div>
//       </main>
//     </div>
//   );
// }
