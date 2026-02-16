import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getSharedPath } from "../../services/pathService";
import { APP_DOWNLOAD_URL } from "../../config/api";

export default function SharePathScreen() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [path, setPath] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getSharedPath(id);
        if (!mounted) return;
        setPath(data);
      } catch (e) {
        if (!mounted) return;
        setError("Chemin introuvable ou indisponible.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, [id]);

  const steps = useMemo(() => {
    const arr = Array.isArray(path?.steps) ? [...path.steps] : [];
    return arr.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [path]);

  if (loading) return <div className="card"><p>Chargement...</p></div>;
  if (error || !path) return <div className="card"><p>{error || "Erreur."}</p></div>;

  const title = path.title || "Chemin partagé";
  const videoUrl = path.video_url || path.videoUrl || "";
  const start = path.start_label || path.departure || "-";
  const end = path.end_label || path.destination || "-";
  const duration = path.duration || "-";

  return (
    <div className="share-grid">
      <div className="card">
        <h2>{title}</h2>
        <p><strong>Trajet:</strong> {start} → {end}</p>
        <p><strong>Durée:</strong> {duration}</p>
        {videoUrl ? (
          <video controls style={{ width: "100%", borderRadius: 12, marginTop: 12 }}>
            <source src={videoUrl} />
          </video>
        ) : (
          <p>Pas de vidéo disponible.</p>
        )}
      </div>

      <div className="card">
        <h3>Étapes du chemin</h3>
        {steps.length === 0 ? (
          <p>Aucune étape fournie.</p>
        ) : (
          <ol className="steps">
            {steps.map((s, i) => (
              <li key={s.id || i}>
                <strong>{s.title || `Étape ${i + 1}`}</strong>
                <p>{s.instruction || s.description || "-"}</p>
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
