import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "tektal_settings_v1";

const DEFAULT_SETTINGS = {
  notifications: true,
  autoplayVideos: true,
  downloadWifiOnly: true,
  darkMode: false,
  language: "fr",
  mapType: "standard",
};

const languageLabel = (lang) => (lang === "fr" ? "Francais" : "English");
const mapTypeLabel = (type) => (type === "standard" ? "Standard" : "Satellite");

export default function Parametres() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!mounted) return;

        if (raw) {
          const parsed = JSON.parse(raw);
          setSettings({ ...DEFAULT_SETTINGS, ...parsed });
        }
      } catch {
        // ignore
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadSettings();
    return () => {
      mounted = false;
    };
  }, []);

  const saveSettings = async (next) => {
    setSaving(true);
    setSettings(next);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      window.alert("Impossible de sauvegarder les parametres.");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (key) => {
    const next = { ...settings, [key]: !settings[key] };
    await saveSettings(next);
  };

  const cycleLanguage = async () => {
    const next = { ...settings, language: settings.language === "fr" ? "en" : "fr" };
    await saveSettings(next);
  };

  const cycleMapType = async () => {
    const next = {
      ...settings,
      mapType: settings.mapType === "standard" ? "satellite" : "standard",
    };
    await saveSettings(next);
  };

  const resetAll = async () => {
    const ok = window.confirm("Remettre les parametres par defaut ?");
    if (!ok) return;
    await saveSettings(DEFAULT_SETTINGS);
    window.alert("Parametres reinitialises.");
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] grid place-items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-amber-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-6">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
          >
            ← Retour
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900">Parametres</h1>
          <div className="w-[84px]" />
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-2 shadow-sm">
          <SettingSwitch
            label="Notifications"
            checked={settings.notifications}
            onChange={() => toggle("notifications")}
          />
          <SettingSwitch
            label="Lecture auto des videos"
            checked={settings.autoplayVideos}
            onChange={() => toggle("autoplayVideos")}
          />
          <SettingSwitch
            label="Telechargement Wi-Fi uniquement"
            checked={settings.downloadWifiOnly}
            onChange={() => toggle("downloadWifiOnly")}
          />
          <SettingSwitch
            label="Mode sombre (UI locale)"
            checked={settings.darkMode}
            onChange={() => toggle("darkMode")}
            last
          />
        </div>

        <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-2 shadow-sm">
          <SettingAction
            label="Langue"
            value={languageLabel(settings.language)}
            onClick={cycleLanguage}
          />
          <SettingAction
            label="Type de carte"
            value={mapTypeLabel(settings.mapType)}
            onClick={cycleMapType}
            last
          />
        </div>

        <button
          onClick={resetAll}
          disabled={saving}
          className="mt-4 w-full rounded-xl bg-red-500 px-4 py-3 font-semibold text-white disabled:opacity-70"
        >
          {saving ? "Sauvegarde..." : "Reinitialiser les parametres"}
        </button>
      </div>
    </div>
  );
}

function SettingSwitch({ label, checked, onChange, last = false }) {
  return (
    <label
      className={`flex min-h-[56px] items-center justify-between gap-4 px-3 py-3 ${
        last ? "" : "border-b border-slate-100"
      }`}
    >
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 accent-amber-400"
      />
    </label>
  );
}

function SettingAction({ label, value, onClick, last = false }) {
  return (
    <button
      onClick={onClick}
      className={`flex min-h-[56px] w-full items-center justify-between px-3 py-3 text-left ${
        last ? "" : "border-b border-slate-100"
      }`}
    >
      <span className="text-sm font-medium text-slate-800">{label}</span>
      <span className="text-sm text-slate-500">{value} →</span>
    </button>
  );
}
