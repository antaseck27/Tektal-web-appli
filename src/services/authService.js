

// import axios from "axios";

// const API_BASE_URL =
//   import.meta.env.VITE_API_BASE_URL || "https://tektal-backend.onrender.com";

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// function authHeaders() {
//   const access = localStorage.getItem("access");
//   return access ? { Authorization: `Bearer ${access}` } : {};
// }

// function parseError(err, fallback = "Une erreur est survenue") {
//   return err?.response?.data || { detail: fallback };
// }

// export async function login({ email, password }) {
//   try {
//     const res = await api.post("/api/auth/login/", { email, password });
//     const body = res.data;
//     const payload = body?.data || body || {};

//     if (payload.access) localStorage.setItem("access", payload.access);
//     if (payload.refresh) localStorage.setItem("refresh", payload.refresh);
//     if (payload.user) localStorage.setItem("user", JSON.stringify(payload.user));

//     return { ok: true, data: body };
//   } catch (err) {
//     return { ok: false, data: parseError(err, "Erreur de connexion") };
//   }
// }

// export async function register({ email, password, first_name, last_name }) {
//   try {
//     const res = await api.post("/api/auth/register/", {
//       email,
//       password,
//       first_name,
//       last_name,
//     });
//     return { ok: true, data: res.data };
//   } catch (err) {
//     return { ok: false, data: parseError(err, "Erreur d'inscription") };
//   }
// }

// export async function getProfile() {
//   try {
//     const res = await api.get("/api/auth/me/", { headers: authHeaders() });
//     return { ok: true, data: res.data?.data || res.data };
//   } catch (err) {
//     return { ok: false, data: parseError(err, "Erreur profil") };
//   }
// }

// export async function forgotPassword(email) {
//   try {
//     const res = await api.post("/api/auth/forgot-password/", { email });
//     return { ok: true, data: res.data };
//   } catch (err) {
//     return { ok: false, data: parseError(err, "Erreur mot de passe oublié") };
//   }
// }

// export async function resetPassword({ token, new_password }) {
//   try {
//     const res = await api.post("/api/auth/reset-password/", { token, new_password });
//     return { ok: true, data: res.data };
//   } catch (err) {
//     return { ok: false, data: parseError(err, "Erreur de réinitialisation") };
//   }
// }

// export function logout() {
//   localStorage.removeItem("access");
//   localStorage.removeItem("refresh");
//   localStorage.removeItem("user");
// }

// export function getAccessToken() {
//   return localStorage.getItem("access");
// }

// export function getCurrentUser() {
//   try {
//     const raw = localStorage.getItem("user");
//     return raw ? JSON.parse(raw) : null;
//   } catch {
//     return null;
//   }
// }

// export default api;



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

function parseError(err, fallback = "Une erreur est survenue") {
  return err?.response?.data || { detail: fallback };
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

function saveAuth(payload) {
  if (payload?.access) localStorage.setItem("access", payload.access);
  if (payload?.refresh) localStorage.setItem("refresh", payload.refresh);
  if (payload?.user) localStorage.setItem("user", JSON.stringify(payload.user));
}

function clearAuth() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");
}

export async function login({ email, password }) {
  try {
    const res = await api.post("/api/auth/jwt/create/", {
      email: email?.trim().toLowerCase(),
      password,
    });

    saveAuth(res.data);
    return { ok: true, data: res.data, message: "Connexion réussie." };
  } catch (err) {
    const data = parseError(err, "Erreur de connexion");
    return { ok: false, data, message: extractMessage(data, "Erreur de connexion") };
  }
}

export async function register({ email, password, first_name, last_name }) {
  try {
    const res = await api.post("/api/auth/users/", {
      email: email?.trim().toLowerCase(),
      password,
      first_name: first_name?.trim() || "",
      last_name: last_name?.trim() || "",
    });

    return { ok: true, data: res.data, message: "Compte créé avec succès." };
  } catch (err) {
    const data = parseError(err, "Erreur d'inscription");
    return { ok: false, data, message: extractMessage(data, "Erreur d'inscription") };
  }
}

export async function getProfile() {
  const access = localStorage.getItem("access");
  if (!access) {
    return { ok: false, data: { detail: "Non authentifié" }, message: "Non authentifié" };
  }

  try {
    const res = await api.get("/api/auth/users/me/", {
      headers: { Authorization: `Bearer ${access}` },
    });

    localStorage.setItem("user", JSON.stringify(res.data));
    return { ok: true, data: res.data };
  } catch (err) {
    const data = parseError(err, "Erreur profil");
    return { ok: false, data, message: extractMessage(data, "Erreur profil") };
  }
}

export async function forgotPassword(email) {
  try {
    const res = await api.post("/api/auth/users/reset_password/", { email });
    return { ok: true, data: res.data, message: "Email de réinitialisation envoyé." };
  } catch (err) {
    const data = parseError(err, "Erreur mot de passe oublié");
    return {
      ok: false,
      data,
      message: extractMessage(data, "Erreur mot de passe oublié"),
    };
  }
}

export async function resetPassword({ uid, token, new_password, re_new_password }) {
  try {
    const res = await api.post("/api/auth/users/reset_password_confirm/", {
      uid,
      token,
      new_password,
      re_new_password: re_new_password ?? new_password,
    });
    return { ok: true, data: res.data, message: "Mot de passe réinitialisé." };
  } catch (err) {
    const data = parseError(err, "Erreur de réinitialisation");
    return {
      ok: false,
      data,
      message: extractMessage(data, "Erreur de réinitialisation"),
    };
  }
}

export async function refreshAccessToken() {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) return { ok: false, data: { detail: "No refresh token" } };

  try {
    const res = await api.post("/api/auth/jwt/refresh/", { refresh });
    if (res.data?.access) localStorage.setItem("access", res.data.access);
    return { ok: true, data: res.data };
  } catch (err) {
    clearAuth();
    return { ok: false, data: parseError(err, "Session expirée") };
  }
}

export function logout() {
  clearAuth();
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
