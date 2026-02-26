// // import http from './http';

// // // ✅ Login
// // export async function login(email, password) {
// //   try {
// //     const response = await http.post('/api/token/', {
// //       email,
// //       password,
// //     });

// //     const { access, refresh } = response.data;

// //     localStorage.setItem('access_token', access);
// //     localStorage.setItem('refresh_token', refresh);

// //     // Récupérer les infos utilisateur
// //     const user = await getCurrentUser();

// //     return { ok: true, user };
// //   } catch (error) {
// //     console.error('Erreur login:', error);
// //     return {
// //       ok: false,
// //       error: error.response?.data?.detail || 'Email ou mot de passe incorrect',
// //     };
// //   }
// // }

// // // ✅ Register
// // export async function register(email, password, firstName, lastName) {
// //   try {
// //     await http.post('/api/auth/users/', {
// //       email,
// //       password,
// //       first_name: firstName,
// //       last_name: lastName,
// //     });

// //     return {
// //       ok: true,
// //       message: 'Inscription réussie ! Vérifiez votre email pour activer votre compte.',
// //     };
// //   } catch (error) {
// //     console.error('Erreur register:', error);
// //     const errors = error.response?.data || {};
    
// //     let errorMessage = 'Erreur lors de l\'inscription';
    
// //     if (errors.email) {
// //       errorMessage = Array.isArray(errors.email) ? errors.email[0] : errors.email;
// //     } else if (errors.password) {
// //       errorMessage = Array.isArray(errors.password) ? errors.password[0] : errors.password;
// //     }

// //     return { ok: false, error: errorMessage };
// //   }
// // }

// // // ✅ Get current user
// // export async function getCurrentUser() {
// //   const token = localStorage.getItem('access_token');
  
// //   if (!token) {
// //     throw new Error('Non authentifié');
// //   }

// //   const response = await http.get('/api/auth/users/me/', {
// //     headers: {
// //       Authorization: `Bearer ${token}`,
// //     },
// //   });

// //   return response.data;
// // }

// // // ✅ Logout
// // export function logout() {
// //   localStorage.removeItem('access_token');
// //   localStorage.removeItem('refresh_token');
// // }

// // // ✅ Intercepteur pour ajouter le token automatiquement
// // http.interceptors.request.use(
// //   (config) => {
// //     const token = localStorage.getItem('access_token');
// //     if (token) {
// //       config.headers.Authorization = `Bearer ${token}`;
// //     }
// //     return config;
// //   },
// //   (error) => Promise.reject(error)
// // );

// // // ✅ Intercepteur pour refresh le token si expiré
// // http.interceptors.response.use(
// //   (response) => response,
// //   async (error) => {
// //     const originalRequest = error.config;

// //     if (error.response?.status === 401 && !originalRequest._retry) {
// //       originalRequest._retry = true;

// //       const refreshToken = localStorage.getItem('refresh_token');
      
// //       if (refreshToken) {
// //         try {
// //           const response = await http.post('/api/token/refresh/', {
// //             refresh: refreshToken,
// //           });

// //           const { access } = response.data;
// //           localStorage.setItem('access_token', access);

// //           originalRequest.headers.Authorization = `Bearer ${access}`;
// //           return http(originalRequest);
// //         } catch (refreshError) {
// //           logout();
// //           window.location.href = '/login';
// //         }
// //       }
// //     }

// //     return Promise.reject(error);
// //   }
// // );


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

// function normalizeError(err, fallback = "Une erreur est survenue") {
//   return (
//     err?.response?.data || {
//       detail: err?.message || fallback,
//     }
//   );
// }

// export async function login({ email, password }) {
//   try {
//     const res = await api.post("/api/login/", { email, password });
//     const body = res.data;
//     const payload = body?.data || {};

//     if (payload.access) localStorage.setItem("access", payload.access);
//     if (payload.refresh) localStorage.setItem("refresh", payload.refresh);
//     if (payload.user) localStorage.setItem("user", JSON.stringify(payload.user));

//     return { ok: true, data: body };
//   } catch (err) {
//     return { ok: false, data: normalizeError(err, "Erreur de connexion") };
//   }
// }

// export async function register({ email, password, first_name, last_name }) {
//   try {
//     const res = await api.post("/api/register/", {
//       email,
//       password,
//       first_name,
//       last_name,
//     });
//     return { ok: true, data: res.data };
//   } catch (err) {
//     return { ok: false, data: normalizeError(err, "Erreur d'inscription") };
//   }
// }

// export async function getProfile() {
//   try {
//     const access = localStorage.getItem("access");
//     const res = await api.get("/api/me/", {
//       headers: access ? { Authorization: `Bearer ${access}` } : {},
//     });
//     return { ok: true, data: res.data };
//   } catch (err) {
//     return { ok: false, data: normalizeError(err, "Erreur profil") };
//   }
// }

// export async function forgotPassword(email) {
//   try {
//     const res = await api.post("/api/forgot-password/", { email });
//     return { ok: true, data: res.data };
//   } catch (err) {
//     return { ok: false, data: normalizeError(err, "Erreur mot de passe oublié") };
//   }
// }

// export async function resetPassword({ token, new_password }) {
//   try {
//     const res = await api.post("/api/reset-password/", { token, new_password });
//     return { ok: true, data: res.data };
//   } catch (err) {
//     return { ok: false, data: normalizeError(err, "Erreur de réinitialisation") };
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
