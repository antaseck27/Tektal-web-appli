export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
export const APP_DOWNLOAD_URL =
  import.meta.env.VITE_APP_DOWNLOAD_URL || "https://expo.dev";


  import axios from "axios";

export const API_BASE_URL =       
  import.meta.env.VITE_API_BASE_URL || "https://tektal-backend.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export function authHeaders() {
  const access = localStorage.getItem("access");
  return access ? { Authorization: `Bearer ${access}` } : {};
}

export function unwrap(data) {
  return data?.data ?? data;
}

export function parseError(err, fallback = "Une erreur est survenue") {
  return err?.response?.data || { detail: fallback };
}

export default api;
