

import api from "./authService";

function authHeaders() {
  const access = localStorage.getItem("access");
  return access ? { Authorization: `Bearer ${access}` } : {};
}

function unwrap(data) {
  return data?.data ?? data;
}

function extractMessage(data, fallback = "Une erreur est survenue") {
  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (data.detail) return data.detail;
  const firstKey = Object.keys(data)[0];
  if (!firstKey) return fallback;
  const value = data[firstKey];
  if (Array.isArray(value)) return String(value[0]);
  if (typeof value === "string") return value;
  return fallback;
}

function parseError(err, fallback) {
  const data = err?.response?.data || { detail: fallback };
  return { ok: false, status: err?.response?.status || 0, data, message: extractMessage(data, fallback) };
}

function normalizeShareInput(input) {
  const raw = String(input || "").trim();
  if (!raw) return "";

  if (raw.startsWith("http")) {
    const afterShare = raw.split("/share/")[1] || "";
    return afterShare.split("/")[0];
  }

  return raw.replaceAll("/", "");
}

export async function createPath(payload) {
  try {
    const res = await api.post("/api/paths/create/", payload, { headers: authHeaders() });
    return { ok: true, status: res.status, data: unwrap(res.data) };
  } catch (err) {
    return parseError(err, "Erreur création chemin");
  }
}

export async function getPaths(params = {}) {
  try {
    const res = await api.get("/api/paths/", { params, headers: authHeaders() });
    return { ok: true, status: res.status, data: unwrap(res.data) };
  } catch (err) {
    return parseError(err, "Erreur chargement chemins");
  }
}

export async function getPathById(id) {
  try {
    const res = await api.get(`/api/paths/${id}/`, { headers: authHeaders() });
    return { ok: true, status: res.status, data: unwrap(res.data) };
  } catch (err) {
    return parseError(err, "Erreur chargement chemin");
  }
}

export async function toggleFavorite(pathId) {
  try {
    const res = await api.post(`/api/paths/${pathId}/favorite/`, {}, { headers: authHeaders() });
    return { ok: true, status: res.status, data: unwrap(res.data) };
  } catch (err) {
    return parseError(err, "Erreur favoris");
  }
}

export async function getFavorites() {
  try {
    const res = await api.get("/api/users/me/favorites/", { headers: authHeaders() });
    return { ok: true, status: res.status, data: unwrap(res.data) };
  } catch (err) {
    return parseError(err, "Erreur chargement favoris");
  }
}

export async function getSharedPath(idOrTokenOrUrl) {
  try {
    const token = normalizeShareInput(idOrTokenOrUrl);
    const res = await api.get(`/api/share/${token}/`);
    return { ok: true, status: res.status, data: unwrap(res.data) };
  } catch (err) {
    return parseError(err, "Erreur chemin partagé");
  }
}


