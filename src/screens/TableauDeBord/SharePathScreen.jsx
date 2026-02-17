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

  const steps = useMemo(() => {
    const raw = Array.isArray(path?.steps) ? path.steps : [];
    return [...raw].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [path]);

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
          Télécharger l’application
        </a>
      </div>
    );
  }

  const title = path.title || "Chemin partagé";
  const videoUrl = path.video_url || path.videoUrl || "";
  const startLabel = path.start_label || path.departure || "-";
  const endLabel = path.end_label || path.destination || "-";
  const duration = path.duration || "-";
  const creator = path.creator || path.user_name || "Utilisateur";

  return (
    <div className="share-grid">
      <div className="card">
        <h2>{title}</h2>
        <p>
          <strong>Trajet :</strong> {startLabel} → {endLabel}
        </p>
        <p>
          <strong>Durée :</strong> {duration}
        </p>
        <p>
          <strong>Partagé par :</strong> {creator}
        </p>

        {videoUrl ? (
          <video controls style={{ width: "100%", borderRadius: 12, marginTop: 12 }}>
            <source src={videoUrl} />
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>
        ) : (
          <div style={{ marginTop: 12, padding: 14, background: "#f8f8f8", borderRadius: 12 }}>
            Vidéo non disponible.
          </div>
        )}

        {mapPoints.length > 0 ? (
          <div className="map-wrap">
            <MapContainer center={mapPoints[0]} zoom={15} className="leaflet-map">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Polyline positions={mapPoints} />
              <Marker position={mapPoints[0]} />
              <Marker position={mapPoints[mapPoints.length - 1]} />
            </MapContainer>
          </div>
        ) : (
          <p style={{ marginTop: 12 }}>Carte indisponible (coordonnées manquantes).</p>
        )}
      </div>

      <div className="card">
        <h3>Étapes du chemin</h3>
        {steps.length === 0 ? (
          <p>Aucune étape fournie pour ce chemin.</p>
        ) : (
          <ol className="steps">
            {steps.map((step, idx) => (
              <li key={step.id || idx}>
                <strong>{step.title || `Étape ${idx + 1}`}</strong>
                <p>{step.instruction || step.description || "-"}</p>
              </li>
            ))}
          </ol>
        )}

        <a className="btn-primary full" href={APP_DOWNLOAD_URL} target="_blank" rel="noreferrer">
          Télécharger l’application
        </a>
      </div>
    </div>
  );
}
