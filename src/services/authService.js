

import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://tektal-backend.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

function authHeaders() {
  const access = localStorage.getItem("access");
  return access ? { Authorization: `Bearer ${access}` } : {};
}

function parseError(err, fallback = "Une erreur est survenue") {
  return err?.response?.data || { detail: fallback };
}

export async function login({ email, password }) {
  try {
    const res = await api.post("/api/auth/login/", { email, password });
    const body = res.data;
    const payload = body?.data || body || {};

    if (payload.access) localStorage.setItem("access", payload.access);
    if (payload.refresh) localStorage.setItem("refresh", payload.refresh);
    if (payload.user) localStorage.setItem("user", JSON.stringify(payload.user));

    return { ok: true, data: body };
  } catch (err) {
    return { ok: false, data: parseError(err, "Erreur de connexion") };
  }
}

export async function register({ email, password, first_name, last_name }) {
  try {
    const res = await api.post("/api/auth/register/", {
      email,
      password,
      first_name,
      last_name,
    });
    return { ok: true, data: res.data };
  } catch (err) {
    return { ok: false, data: parseError(err, "Erreur d'inscription") };
  }
}

export async function getProfile() {
  try {
    const res = await api.get("/api/auth/me/", { headers: authHeaders() });
    return { ok: true, data: res.data?.data || res.data };
  } catch (err) {
    return { ok: false, data: parseError(err, "Erreur profil") };
  }
}

export async function forgotPassword(email) {
  try {
    const res = await api.post("/api/auth/forgot-password/", { email });
    return { ok: true, data: res.data };
  } catch (err) {
    return { ok: false, data: parseError(err, "Erreur mot de passe oublié") };
  }
}

export async function resetPassword({ token, new_password }) {
  try {
    const res = await api.post("/api/auth/reset-password/", { token, new_password });
    return { ok: true, data: res.data };
  } catch (err) {
    return { ok: false, data: parseError(err, "Erreur de réinitialisation") };
  }
}

export function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
}

export function getAccessToken() {
  return localStorage.getItem("access");
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default api;
