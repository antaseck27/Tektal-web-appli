import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFavorites, toggleFavorite } from "../../services/pathService";

export default function Favoris() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState([]);

  const normalizeList = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.results)) return payload.results;
    if (Array.isArray(payload?.data?.results)) return payload.data.results;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
  };

  const loadFavorites = async () => {
    setError("");
    try {
      const data = await getFavorites();
      const list = normalizeList(data).map((p) => ({ ...p, isFavorite: true }));
      setFavorites(list);
    } catch (e) {
      setError(e.message || "Impossible de charger les favoris.");
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadFavorites();
      setLoading(false);
    })();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  const openPath = (path) => {
    const token = path.share_token || path.id;
    navigate(`/share/${encodeURIComponent(token)}`);
  };

  const onToggleFavorite = async (path) => {
    const snapshot = favorites;
    setFavorites((prev) => prev.filter((p) => p.id !== path.id));

    try {
      await toggleFavorite(path.id);
    } catch {
      setFavorites(snapshot);
      setError("Impossible de mettre à jour le favori.");
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
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Favoris</h1>
          <p className="mt-1 text-slate-600">Vos chemins enregistrés.</p>
        </div>

        <button
          onClick={onRefresh}
          className="rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700"
        >
          {refreshing ? "..." : "Rafraîchir"}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {favorites.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Aucun favori</h2>
          <p className="mt-2 text-slate-600">
            Ajoutez des chemins en favoris depuis l’accueil.
          </p>
        </div>
      ) : (
        <div className="grid gap-3">
          {favorites.map((path) => (
            <article
              key={path.id || path.share_token}
              className="grid grid-cols-[96px_1fr_auto] items-center gap-3 rounded-2xl bg-white p-3 shadow-sm"
            >
              <button
                onClick={() => openPath(path)}
                className="h-24 w-24 overflow-hidden rounded-xl"
              >
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
                <p className="mt-1 text-xs text-slate-500">
                  Par {path.creator || path.user_name || "Utilisateur"}
                </p>
              </button>

              <button
                onClick={() => onToggleFavorite(path)}
                className="px-2 text-2xl text-red-500"
                aria-label="Retirer des favoris"
              >
                ♥
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
