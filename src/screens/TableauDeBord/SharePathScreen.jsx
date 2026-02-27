



// import { useEffect, useMemo, useState } from "react";
// import { useParams } from "react-router-dom";
// import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
// import L from "leaflet";
// import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";
// import { getSharedPath } from "../../services/pathService";
// import { APP_DOWNLOAD_URL } from "../../config/api";

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });

// export default function SharePathScreen() {
//   const { share_token } = useParams();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [path, setPath] = useState(null);

//   useEffect(() => {
//     let mounted = true;

//     async function loadPath() {
//       setLoading(true);
//       setError("");
//       try {
//         const data = await getSharedPath(share_token);
//         if (!mounted) return;
//         setPath(data);
//       } catch (e) {
//         if (!mounted) return;
//         const detail =
//           e?.response?.data?.detail ||
//           e?.response?.data?.message ||
//           "Lien invalide ou chemin introuvable.";
//         setError(detail);
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     }

//     if (share_token) {
//       loadPath();
//     } else {
//       setError("Token de partage manquant.");
//       setLoading(false);
//     }

//     return () => {
//       mounted = false;
//     };
//   }, [share_token]);

//   // ✅ Trier les étapes par step_number
//   const steps = useMemo(() => {
//     const raw = Array.isArray(path?.steps) ? path.steps : [];
//     return [...raw].sort(
//       (a, b) => (a.step_number ?? a.order ?? 0) - (b.step_number ?? b.order ?? 0)
//     );
//   }, [path]);

//   // ✅ Construire les points GPS pour la carte depuis gps_points (backend)
//   const mapPoints = useMemo(() => {
//     // ✅ Priorité 1 : gps_points depuis le backend (nouveau)
//     if (Array.isArray(path?.gps_points) && path.gps_points.length > 0) {
//       return path.gps_points
//         .map((p) => {
//           const lat = Number(p.latitude ?? p.lat);
//           const lng = Number(p.longitude ?? p.lng);
//           if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
//           return [lat, lng];
//         })
//         .filter(Boolean);
//     }

//     // ✅ Priorité 2 : coordinates (ancien format - compatibilité)
//     if (Array.isArray(path?.coordinates) && path.coordinates.length > 0) {
//       return path.coordinates
//         .map((p) => {
//           const lat = Number(p.latitude ?? p.lat);
//           const lng = Number(p.longitude ?? p.lng);
//           if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
//           return [lat, lng];
//         })
//         .filter(Boolean);
//     }

//     // ✅ Priorité 3 : start/end lat/lng seulement
//     const sLat = Number(path?.start_lat);
//     const sLng = Number(path?.start_lng);
//     const eLat = Number(path?.end_lat);
//     const eLng = Number(path?.end_lng);

//     if (
//       Number.isFinite(sLat) &&
//       Number.isFinite(sLng) &&
//       Number.isFinite(eLat) &&
//       Number.isFinite(eLng)
//     ) {
//       return [
//         [sLat, sLng],
//         [eLat, eLng],
//       ];
//     }

//     return [];
//   }, [path]);

//   // ✅ Formater la durée en secondes → mm:ss
//   const formatDuration = (seconds) => {
//     if (!seconds && seconds !== 0) return "-";
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     if (mins === 0) return `${secs} sec`;
//     return `${mins} min ${secs > 0 ? secs + " sec" : ""}`.trim();
//   };

//   // ✅ Formater le timing d'une étape
//   const formatTime = (seconds) => {
//     if (!seconds && seconds !== 0) return "0:00";
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   if (loading) {
//     return (
//       <div className="card">
//         <h2>Chargement du chemin...</h2>
//         <p>Veuillez patienter.</p>
//       </div>
//     );
//   }

//   if (error || !path) {
//     return (
//       <div className="card">
//         <h2>Chemin introuvable</h2>
//         <p>{error || "Ce lien n'est pas valide."}</p>
//         <a className="btn-primary" href={APP_DOWNLOAD_URL} target="_blank" rel="noreferrer">
//           Télécharger l'application
//         </a>
//       </div>
//     );
//   }

//   const title = path.title || "Chemin partagé";
//   const videoUrl = path.video_url || path.videoUrl || "";
//   const startLabel = path.start_label || path.departure || "-";
//   const endLabel = path.end_label || path.destination || "-";
//   const duration = formatDuration(path.duration);
//   const creator = path.creator || path.user_name || "Utilisateur";
//   const isOfficial = path.is_official || false;
//   const gpsCount = path?.gps_points?.length || 0;

//   return (
//     <div className="share-grid">
//       {/* COLONNE GAUCHE — Infos + Vidéo + Carte GPS */}
//       <div className="card">
//         <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
//           <h2 style={{ margin: 0 }}>{title}</h2>
//           {isOfficial && (
//             <span
//               style={{
//                 background: "#FFD700",
//                 color: "#fff",
//                 fontSize: 11,
//                 fontWeight: "bold",
//                 padding: "2px 10px",
//                 borderRadius: 20,
//               }}
//             >
//               ✓ Officiel
//             </span>
//           )}
//         </div>

//         <p>
//           <strong>Trajet :</strong> {startLabel} → {endLabel}
//         </p>
//         <p>
//           <strong>Durée :</strong> {duration}
//         </p>
//         <p>
//           <strong>Partagé par :</strong> {creator}
//         </p>

//         {/* Vidéo */}
//         {videoUrl ? (
//           <video
//             controls
//             style={{ width: "100%", borderRadius: 12, marginTop: 12 }}
//           >
//             <source src={videoUrl} type="video/mp4" />
//             <source src={videoUrl} type="video/quicktime" />
//             Votre navigateur ne supporte pas la lecture vidéo.
//           </video>
//         ) : (
//           <div
//             style={{
//               marginTop: 12,
//               padding: 14,
//               background: "#f8f8f8",
//               borderRadius: 12,
//             }}
//           >
//             Vidéo non disponible.
//           </div>
//         )}

//         {/* Carte GPS */}
//         {mapPoints.length > 0 ? (
//           <div className="map-wrap" style={{ marginTop: 16 }}>
//             {/* ✅ Affichage nombre de points GPS */}
//             {gpsCount > 0 && (
//               <p style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
//                 📍 {gpsCount} points GPS enregistrés
//               </p>
//             )}
//             <MapContainer
//               center={mapPoints[0]}
//               zoom={15}
//               className="leaflet-map"
//             >
//               <TileLayer
//                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               />
//               <Polyline positions={mapPoints} color="#007AFF" weight={4} />
//               <Marker position={mapPoints[0]} />
//               <Marker position={mapPoints[mapPoints.length - 1]} />
//             </MapContainer>
//           </div>
//         ) : (
//           <div style={{ marginTop: 16, padding: 14, background: "#f8f8f8", borderRadius: 12 }}>
//             <p style={{ margin: 0, color: "#999" }}>
//               Carte GPS indisponible (coordonnées manquantes).
//             </p>
//           </div>
//         )}
//       </div>

//       {/* COLONNE DROITE — Étapes + Téléchargement */}
//       <div className="card">
//         <h3>Étapes du trajet ({steps.length})</h3>

//         {steps.length === 0 ? (
//           <p>Aucune étape fournie pour ce chemin.</p>
//         ) : (
//           <ol className="steps" style={{ paddingLeft: 0, listStyle: "none" }}>
//             {steps.map((step, idx) => (
//               <li
//                 key={step.id || idx}
//                 style={{
//                   display: "flex",
//                   gap: 12,
//                   marginBottom: 16,
//                   padding: 12,
//                   background: "#F8F9FA",
//                   borderRadius: 12,
//                   borderLeft: "4px solid #FEBD00",
//                 }}
//               >
//                 {/* Numéro étape */}
//                 <div
//                   style={{
//                     minWidth: 32,
//                     height: 32,
//                     borderRadius: "50%",
//                     background: "#FEBD00",
//                     color: "#fff",
//                     fontWeight: "bold",
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     fontSize: 14,
//                   }}
//                 >
//                   {step.step_number ?? idx + 1}
//                 </div>

//                 {/* Contenu étape */}
//                 <div style={{ flex: 1 }}>
//                   <div style={{ fontWeight: "bold", marginBottom: 4 }}>
//                     Étape {step.step_number ?? idx + 1}
//                   </div>

//                   {/* Timing */}
//                   {(step.start_time !== undefined || step.end_time !== undefined) && (
//                     <div
//                       style={{
//                         fontSize: 12,
//                         color: "#666",
//                         marginBottom: 6,
//                       }}
//                     >
//                       ⏱ {formatTime(step.start_time)} → {formatTime(step.end_time)}
//                     </div>
//                   )}

//                   {/* Texte de l'étape */}
//                   <p style={{ margin: 0, color: "#333", fontSize: 14 }}>
//                     {step.text || step.instruction || step.description || "-"}
//                   </p>
//                 </div>
//               </li>
//             ))}
//           </ol>
//         )}

//         <a
//           className="btn-primary full"
//           href={APP_DOWNLOAD_URL}
//           target="_blank"
//           rel="noreferrer"
//           style={{ display: "block", textAlign: "center", marginTop: 16 }}
//         >
//           📱 Télécharger l'application
//         </a>
//       </div>
//     </div>
//   );
// }




import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
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
      <div className="min-h-screen bg-slate-50 grid place-items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-amber-400" />
      </div>
    );
  }

  if (error || !path) {
    return (
      <div className="min-h-screen bg-slate-50 grid place-items-center px-6">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Chemin introuvable</h2>
          <p className="mt-2 text-slate-600">{error || "Ce lien n'est pas valide."}</p>
          <a
            className="mt-6 inline-block rounded-xl bg-amber-400 px-5 py-3 font-semibold text-slate-900 hover:bg-amber-300"
            href={APP_DOWNLOAD_URL}
            target="_blank"
            rel="noreferrer"
          >
            Télécharger l’application
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
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-[1000] border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            {/* <div className="h-10 w-10 rounded-xl bg-amber-400 grid place-items-center shadow-sm"> */}
              <div className="flex items-center gap-3">
  <img
    src={logoTektal}
    alt="TEKTAL"
    className="h-10 w-10 rounded-xl object-cover shadow-sm"
  />
  <div>
    <h1 className="text-xl font-extrabold tracking-tight">TEKTAL</h1>
    <p className="text-xs text-slate-500">
      Explorez les chemins partagés, étape par étape.
    </p>
  </div>
</div>

             
            {/* </div> */}
            {/* <div>
              <h1 className="text-xl font-extrabold tracking-tight">TEKTAL</h1>
              <p className="text-xs text-slate-500">
                Explorez les chemins partagés, étape par étape.
              </p>
            </div> */}
          </div>

          <a
            href={APP_DOWNLOAD_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-slate-900 hover:bg-amber-300"
          >
            Télécharger l’app
          </a>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-4 px-5 py-4 lg:grid-cols-[1.45fr_1fr]">
        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-2xl font-extrabold">{title}</h2>
            <p className="mt-1 text-slate-600">{startLabel} → {endLabel}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">⏱ {formatDuration(path.duration)}</span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">📍 {gpsCount} points</span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">👤 {creator}</span>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {mapPoints.length > 0 ? (
              <MapContainer className="h-[430px] w-full" center={mapPoints[0]} zoom={15}>
                <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <FitRoute points={mapPoints} />
                <Polyline positions={mapPoints} color="#0ea5e9" weight={5} opacity={0.9} />
                <Marker position={mapPoints[0]} icon={startIcon} />
                <Marker position={mapPoints[mapPoints.length - 1]} icon={endIcon} />
              </MapContainer>
            ) : (
              <div className="grid h-[430px] place-items-center text-slate-500">Carte indisponible</div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <h3 className="mb-2 text-sm font-semibold text-slate-700">Vidéo du trajet</h3>
            {videoUrl ? (
              <video controls className="w-full max-h-[260px] rounded-xl object-contain bg-black">
                <source src={videoUrl} />
                Votre navigateur ne supporte pas la lecture vidéo.
              </video>
            ) : (
              <p className="text-slate-500">Vidéo non disponible.</p>
            )}
          </div>
        </section>

        <aside className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <button
              onClick={() => setStepsOpen((v) => !v)}
              className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
            >
              {stepsOpen ? "Masquer étapes" : "Afficher étapes"} ({steps.length})
            </button>
          </div>

          {stepsOpen &&
            (steps.length === 0 ? (
              <p className="text-slate-500">Aucune étape fournie.</p>
            ) : (
              <div className="max-h-[620px] space-y-2 overflow-y-auto pr-1">
                {steps.map((step, idx) => {
                  const n = step.step_number ?? idx + 1;
                  return (
                    <article key={step.id || idx} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-600">Étape {n}</span>
                        <span className="text-[11px] text-slate-500">
                          {formatTime(step.start_time)} → {formatTime(step.end_time)}
                        </span>
                      </div>
                      <p className="text-sm leading-5 text-slate-700">
                        {step.text || step.instruction || step.description || "-"}
                      </p>
                    </article>
                  );
                })}
              </div>
            ))}
        </aside>
      </div>
    </div>
  );
}
