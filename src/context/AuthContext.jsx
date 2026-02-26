// import { createContext, useContext, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import * as authService from '../services/authService';

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // ✅ Charger l'utilisateur au démarrage
//   useEffect(() => {
//     const loadUser = async () => {
//       const token = localStorage.getItem('access_token');
//       if (token) {
//         try {
//           const userData = await authService.getCurrentUser();
//           setUser(userData);
//         } catch (error) {
//           console.error('Erreur chargement utilisateur:', error);
//           localStorage.removeItem('access_token');
//           localStorage.removeItem('refresh_token');
//         }
//       }
//       setLoading(false);
//     };

//     loadUser();
//   }, []);

//   const login = async (email, password) => {
//     const result = await authService.login(email, password);
//     if (result.ok) {
//       setUser(result.user);
//       navigate('/app');
//       return { ok: true };
//     }
//     return { ok: false, error: result.error };
//   };

//   const register = async (email, password, firstName, lastName) => {
//     const result = await authService.register(email, password, firstName, lastName);
//     return result;
//   };

//   const logout = () => {
//     authService.logout();
//     setUser(null);
//     navigate('/');
//   };

//   const value = {
//     user,
//     loading,
//     isAuthenticated: !!user,
//     login,
//     register,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth doit être utilisé dans AuthProvider');
//   }
//   return context;
// }



import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("access"); // ✅ clé corrigée
      if (token) {
        try {
          const res = await authService.getProfile(); // ✅ fonction service cohérente
          if (res?.ok) {
            setUser(res.data || null);
          } else {
            authService.logout();
            setUser(null);
          }
        } catch (error) {
          console.error("Erreur chargement utilisateur:", error);
          authService.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    const result = await authService.login({ email, password }); // ✅ signature corrigée
    if (result.ok) {
      const profile = await authService.getProfile();
      if (profile.ok) setUser(profile.data || null);
      navigate("/app", { replace: true });
      return { ok: true };
    }
    return { ok: false, error: result.message || result.data?.detail };
  };

  const register = async (email, password, firstName, lastName) => {
    return authService.register({
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    });
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate("/", { replace: true });
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!localStorage.getItem("access"), // ✅ basé sur token
    login,
    register,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans AuthProvider");
  }
  return context;
}
