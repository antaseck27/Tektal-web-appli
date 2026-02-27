// // import http from "./http";

// // // ✅ Récupère un chemin partagé via son share_token
// // export async function getSharedPath(share_token) {
// //   const res = await http.get(`/api/share/${share_token}/`);
// //   return res.data;
// // }
// import api from "./authService";

// function authHeaders() {
//   const access = localStorage.getItem("access");
//   return access ? { Authorization: `Bearer ${access}` } : {};
// }

// function unwrap(data) {
//   return data?.data ?? data;
// }

// function normalizeShareInput(input) {
//   const raw = String(input || "").trim();
//   if (!raw) return "";

//   // Accepte une URL complète et extrait le token après /share/
//   if (raw.startsWith("http")) {
//     const afterShare = raw.split("/share/")[1] || "";
//     return afterShare.split("/")[0];
//   }

//   // Accepte directement token ou id
//   return raw.replaceAll("/", "");
// }

// export async function createPath(payload) {
//   const res = await api.post("/api/paths/create/", payload, {
//     headers: authHeaders(),
//   });
//   return unwrap(res.data);
// }

// export async function getPaths(params = {}) {
//   const res = await api.get("/api/paths/", {
//     params,
//     headers: authHeaders(),
//   });
//   return unwrap(res.data);
// }

// export async function getPathById(id) {
//   const res = await api.get(`/api/paths/${id}/`, {
//     headers: authHeaders(),
//   });
//   return unwrap(res.data);
// }

// export async function toggleFavorite(pathId) {
//   const res = await api.post(
//     `/api/paths/${pathId}/favorite/`, 
//     {},
//     { headers: authHeaders() }
//   );
//   return unwrap(res.data);
// }

// export async function getFavorites() {
//   const res = await api.get("/api/users/me/favorites/", {
//     headers: authHeaders(),
//   });
//   return unwrap(res.data);
// }

// export async function getSharedPath(idOrTokenOrUrl) {
//   const token = normalizeShareInput(idOrTokenOrUrl);
//   const res = await api.get(`/api/share/${token}/`);
//   return unwrap(res.data);
// }

import api from "./authService";

function unwrap(data) {
  return data?.data ?? data;
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

export async function getSharedPath(idOrTokenOrUrl) {
  const token = normalizeShareInput(idOrTokenOrUrl);
  const res = await api.get(`/api/share/${token}/`);
  return unwrap(res.data);
}
