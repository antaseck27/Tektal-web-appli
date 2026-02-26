import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../services/authService";

export default function EditProfil() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    campus: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getProfile();
      if (res?.ok) {
        setForm({
          first_name: res.data?.first_name || "",
          last_name: res.data?.last_name || "",
          campus: res.data?.campus || "Bakeli Dakar",
        });
      }
      setLoading(false);
    })();
  }, []);

  const onChange = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    // TODO: brancher updateProfile API
    setTimeout(() => {
      setSaving(false);
      navigate("/profil");
    }, 600);
  };

  if (loading) return <div className="p-6">Chargement...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Modifier le profil</h1>
      <form onSubmit={onSave} className="mt-4 grid gap-3 max-w-lg">
        <input className="rounded-xl border px-4 py-3" placeholder="Prénom" value={form.first_name} onChange={onChange("first_name")} />
        <input className="rounded-xl border px-4 py-3" placeholder="Nom" value={form.last_name} onChange={onChange("last_name")} />
        <input className="rounded-xl border px-4 py-3" placeholder="Campus" value={form.campus} onChange={onChange("campus")} />
        <div className="flex gap-2">
          <button type="button" onClick={() => navigate("/profil")} className="rounded-xl border px-4 py-2">Annuler</button>
          <button type="submit" disabled={saving} className="rounded-xl bg-amber-400 px-4 py-2 font-semibold text-slate-900">
            {saving ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}
