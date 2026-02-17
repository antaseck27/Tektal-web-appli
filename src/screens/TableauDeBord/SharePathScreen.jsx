import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { getSharedPath } from "../../services/pathService";
import { APP_DOWNLOAD_URL } from "../../config/api";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function SharePathScreen() {
  const { share_token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [path, setPath] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadPath() {
      setLoading(true);
      setError("");
      try {
        const data = await getSharedPath(share_token);
        if (!mounted) return;
        setPath(data);
      } catch (e) {
        if (!mounted) return;
        const detail =
          e?.response?.data?.detail ||
          e?.response?.data?.message ||
          "Lien invalide ou chemin introuvable.";
        setError(detail);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (share_token) {
      loadPath();
    } else {
      setError("Token de partage manquant.");
      setLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [share_token]);

  // ✅ Trier les étapes par step_number
  const steps = useMemo(() => {
    const raw = Array.isArray(path?.steps) ? path.steps : [];
    return [...raw].sort(
      (a, b) => (a.step_number ?? a.order ?? 0) - (b.step_number ?? b.order ?? 0)
    );
  }, [path]);

  // ✅ Construire les points GPS pour la carte
  const mapPoints = useMemo(() => {
    if (Array.isArray(path?.coordinates) && path.coordinates.length > 0) {
      return path.coordinates
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

    if (
      Number.isFinite(sLat) &&
      Number.isFinite(sLng) &&
      Number.isFinite(eLat) &&
      Number.isFinite(eLng)
    ) {
      return [
        [sLat, sLng],
        [eLat, eLng],
      ];
    }

    return [];
  }, [path]);

  // ✅ Formater la durée en secondes → mm:ss
  const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return "-";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs} sec`;
    return `${mins} min ${secs > 0 ? secs + " sec" : ""}`.trim();
  };

  // ✅ Formater le timing d'une étape
  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="card">
        <h2>Chargement du chemin...</h2>
        <p>Veuillez patienter.</p>
      </div>
    );
  }

  if (error || !path) {
    return (
      <div className="card">
        <h2>Chemin introuvable</h2>
        <p>{error || "Ce lien n'est pas valide."}</p>
        <a className="btn-primary" href={APP_DOWNLOAD_URL} target="_blank" rel="noreferrer">
          Télécharger l'application
        </a>
      </div>
    );
  }

  const title = path.title || "Chemin partagé";
  const videoUrl = path.video_url || path.videoUrl || "";
  const startLabel = path.start_label || path.departure || "-";
  const endLabel = path.end_label || path.destination || "-";
  const duration = formatDuration(path.duration);
  const creator = path.creator || path.user_name || "Utilisateur";
  const isOfficial = path.is_official || false;

  return (
    <div className="share-grid">
      {/* COLONNE GAUCHE — Infos + Vidéo + Carte GPS */}
      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <h2 style={{ margin: 0 }}>{title}</h2>
          {isOfficial && (
            <span
              style={{
                background: "#FFD700",
                color: "#fff",
                fontSize: 11,
                fontWeight: "bold",
                padding: "2px 10px",
                borderRadius: 20,
              }}
            >
              ✓ Officiel
            </span>
          )}
        </div>

        <p>
          <strong>Trajet :</strong> {startLabel} → {endLabel}
        </p>
        <p>
          <strong>Durée :</strong> {duration}
        </p>
        <p>
          <strong>Partagé par :</strong> {creator}
        </p>

        {/* Vidéo */}
        {videoUrl ? (
          <video
            controls
            style={{ width: "100%", borderRadius: 12, marginTop: 12 }}
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/quicktime" />
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>
        ) : (
          <div
            style={{
              marginTop: 12,
              padding: 14,
              background: "#f8f8f8",
              borderRadius: 12,
            }}
          >
            Vidéo non disponible.
          </div>
        )}

        {/* Carte GPS */}
        {mapPoints.length > 0 ? (
          <div className="map-wrap" style={{ marginTop: 16 }}>
            <MapContainer
              center={mapPoints[0]}
              zoom={15}
              className="leaflet-map"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Polyline positions={mapPoints} color="#007AFF" weight={4} />
              <Marker position={mapPoints[0]} />
              <Marker position={mapPoints[mapPoints.length - 1]} />
            </MapContainer>
          </div>
        ) : (
          <div style={{ marginTop: 16, padding: 14, background: "#f8f8f8", borderRadius: 12 }}>
            <p style={{ margin: 0, color: "#999" }}>
              Carte GPS indisponible (coordonnées manquantes).
            </p>
          </div>
        )}
      </div>

      {/* COLONNE DROITE — Étapes + Téléchargement */}
      <div className="card">
        <h3>Étapes du trajet ({steps.length})</h3>

        {steps.length === 0 ? (
          <p>Aucune étape fournie pour ce chemin.</p>
        ) : (
          <ol className="steps" style={{ paddingLeft: 0, listStyle: "none" }}>
            {steps.map((step, idx) => (
              <li
                key={step.id || idx}
                style={{
                  display: "flex",
                  gap: 12,
                  marginBottom: 16,
                  padding: 12,
                  background: "#F8F9FA",
                  borderRadius: 12,
                  borderLeft: "4px solid #FEBD00",
                }}
              >
                {/* Numéro étape */}
                <div
                  style={{
                    minWidth: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "#FEBD00",
                    color: "#fff",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                  }}
                >
                  {step.step_number ?? idx + 1}
                </div>

                {/* Contenu étape */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", marginBottom: 4 }}>
                    Étape {step.step_number ?? idx + 1}
                  </div>

                  {/* Timing */}
                  {(step.start_time !== undefined || step.end_time !== undefined) && (
                    <div
                      style={{
                        fontSize: 12,
                        color: "#666",
                        marginBottom: 6,
                      }}
                    >
                      ⏱ {formatTime(step.start_time)} → {formatTime(step.end_time)}
                    </div>
                  )}

                  {/* Texte de l'étape */}
                  <p style={{ margin: 0, color: "#333", fontSize: 14 }}>
                    {step.text || step.instruction || step.description || "-"}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}

         <a 
          className="btn-primary full"
          href={APP_DOWNLOAD_URL}
          target="_blank"
          rel="noreferrer"
          style={{ display: "block", textAlign: "center", marginTop: 16 }}
        >
          📱 Télécharger l'application
        </a>
      </div>
    </div>
  );
}