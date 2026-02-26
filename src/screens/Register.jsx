

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const onChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (
      !form.first_name ||
      !form.last_name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setStatus({ type: "error", message: "Tous les champs sont obligatoires." });
      return;
    }

    if (form.password.length < 6) {
      setStatus({
        type: "error",
        message: "Le mot de passe doit contenir au moins 6 caractères.",
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setStatus({ type: "error", message: "Les mots de passe ne correspondent pas." });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await register({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      if (res.ok) {
        setStatus({
          type: "success",
          message: "Compte créé avec succès. Connectez-vous.",
        });
        setTimeout(() => navigate("/login"), 900);
      } else {
        setStatus({
          type: "error",
          message:
            res.data?.message ||
            res.data?.detail ||
            "Impossible de créer le compte.",
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

          <h1 className="text-3xl font-extrabold text-white">Inscription</h1>
          <p className="mt-1 text-sm text-slate-300">Créez votre compte TEKTAL</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Prénom"
                value={form.first_name}
                onChange={onChange("first_name")}
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-300 outline-none focus:border-amber-300"
              />
              <input
                type="text"
                placeholder="Nom"
                value={form.last_name}
                onChange={onChange("last_name")}
                className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-300 outline-none focus:border-amber-300"
              />
            </div>

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={onChange("email")}
              className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-300 outline-none focus:border-amber-300"
            />

            <input
              type="password"
              placeholder="Mot de passe"
              value={form.password}
              onChange={onChange("password")}
              className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-300 outline-none focus:border-amber-300"
            />

            <input
              type="password"
              placeholder="Confirmer le mot de passe"
              value={form.confirmPassword}
              onChange={onChange("confirmPassword")}
              className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-slate-300 outline-none focus:border-amber-300"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-amber-300 to-orange-400 px-4 py-3 font-bold text-slate-900 disabled:opacity-70"
            >
              {loading ? "Création..." : "Créer mon compte"}
            </button>

            <div className="text-sm text-slate-300">
              Déjà un compte ?{" "}
              <Link to="/login" className="text-amber-200 hover:text-amber-100 font-semibold">
                Se connecter
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
