// import http from "./http";

// export async function getSharedPath(id) {
//   const res = await http.get(`/api/share/${id}/`);
//   return res.data;
// }


import http from "./http";

export async function getSharedPath(id) {
  try {
    const res = await http.get(`/api/paths/${id}/`);
    return res.data;
  } catch {
    const res = await http.get(`/api/paths/${id}`);
    return res.data;
  }
}



// import http from "./http";

// export async function getSharedPath(id) {
//   const res = await http.get(`/api/paths/${id}/`);
//   return res.data;
// }
