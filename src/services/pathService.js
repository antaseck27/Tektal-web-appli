import http from "./http";

export async function getSharedPath(id) {
  const res = await http.get(`/api/share/${id}/`);
  return res.data;
}
