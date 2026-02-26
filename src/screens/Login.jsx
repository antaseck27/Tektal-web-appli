



import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!email || !password) {
      setStatus({ type: "error", message: "Email et mot de passe obligatoires." });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await login({ email, password });
      if (res.ok) {
        setStatus({ type: "success", message: "Connexion réussie." });
        setTimeout(() => navigate("/app"), 700);
      } else {
        setStatus({
          type: "error",
          message: res.data?.detail || res.data?.message || "Identifiants invalides.",
        });
      }
    } catch {
      setStatus({ type: "error", message: "Erreur réseau. Réessayez." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <div className="absolute -top-40 -left-24 h-96 w-96 rounded-full bg-amber-400/30 blur-3xl" />
      <div className="absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-orange-500/30 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-md items-center px-6">
        <div className="w-full rounded-3xl border border-white/10 bg-white/10 p-7 backdrop-blur-xl shadow-2xl">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-4 text-sm text-slate-200 hover:text-white"
          >
            ← Retour
          </button>

          <h1 className="text-3xl font-extrabold text-white">Connexion</h1>
          <p className="mt-1 text-sm text-slate-300">Accédez à votre espace TEKTAL</p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-300 outline-none focus:border-amber-300"
            />

            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-300 outline-none focus:border-amber-300"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-amber-300 to-orange-400 px-4 py-3 font-bold text-slate-900 disabled:opacity-70"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>

            <div className="flex items-center justify-between text-sm">
              <Link to="/forgot-password" className="text-amber-200 hover:text-amber-100">
                Mot de passe oublié ?
              </Link>
              <Link to="/signup" className="text-amber-200 hover:text-amber-100">
                S'inscrire
              </Link>
            </div>

            {status.message ? (
              <p
                className={`rounded-xl px-3 py-2 text-sm ${
                  status.type === "success"
                    ? "bg-emerald-500/20 text-emerald-200"
                    : "bg-red-500/20 text-red-200"
                }`}
              >
                {status.message}
              </p>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
}
