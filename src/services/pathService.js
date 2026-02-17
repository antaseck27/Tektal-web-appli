import http from "./http";

// ✅ Récupère un chemin partagé via son share_token
export async function getSharedPath(share_token) {
  const res = await http.get(`/api/share/${share_token}/`);
  return res.data;
}