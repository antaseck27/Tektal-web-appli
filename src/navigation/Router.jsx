

// import { Navigate, Route, Routes } from "react-router-dom";
// import AppShell from "../components/layout/AppShell";
// import Welcome from "../screens/Welcome";
// import Accueil from "../screens/TableauDeBord/Accueil";
// import MesChemins from "../screens/TableauDeBord/MesChemins";
// import Favoris from "../screens/TableauDeBord/Favoris";
// import Profil from "../screens/TableauDeBord/Profil";
// import SharePathScreen from "../screens/TableauDeBord/SharePathScreen";

// export default function Router() {
//   return (
//     <Routes>
//       <Route path="/" element={<Welcome />} />

//       <Route
//         path="/app"
//         element={
//           <AppShell>
//             <Accueil />
//           </AppShell>
//         }
//       />
//       <Route
//         path="/mes-chemins"
//         element={
//           <AppShell>
//             <MesChemins />
//           </AppShell>
//         }
//       />
//       <Route
//         path="/favoris"
//         element={
//           <AppShell>
//             <Favoris />
//           </AppShell>
//         }
//       />
//       <Route
//         path="/profil"
//         element={
//           <AppShell>
//             <Profil />
//           </AppShell>
//         }
//       />

//       {/* ✅ Page de partage publique - accessible sans compte */}
//       <Route
//         path="/share/:share_token"
//         element={
//           <AppShell compact>
//             <SharePathScreen />
//           </AppShell>
//         }
//       />

//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }


import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import ProtectedRoute from "../components/ProtectedRoute";
import Welcome from "../screens/Welcome";
import Login from "../screens/Login";
import Register from "../screens/Register";
import Accueil from "../screens/TableauDeBord/Accueil";
import MesChemins from "../screens/TableauDeBord/MesChemins";
import Favoris from "../screens/TableauDeBord/Favoris";
import Profil from "../screens/TableauDeBord/Profil";
import SharePathScreen from "../screens/TableauDeBord/SharePathScreen";
import EditProfil from "../screens/TableauDeBord/EditProfil";
import Parametres from "../screens/TableauDeBord/Parametres";
import Aide from "../screens/TableauDeBord/Aide";


export default function Router() {
  return (
    <Routes>
      {/* Pages publiques */}
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/register" element={<Register />} /> */}
      <Route path="/signup" element={<Register />} />


      {/* Page de partage publique - accessible sans compte */}
      <Route
        path="/share/:share_token"
        element={
          <AppShell compact>
            <SharePathScreen />
          </AppShell>
        }
      />

      {/* Pages protégées - nécessitent authentification */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppShell>
              <Accueil />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mes-chemins"
        element={
          <ProtectedRoute>
            <AppShell>
              <MesChemins />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/favoris"
        element={
          <ProtectedRoute>
            <AppShell>
              <Favoris />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profil"
        element={
          <ProtectedRoute>
            <AppShell>
              <Profil />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route path="/profil/edit" element={<ProtectedRoute><AppShell><EditProfil /></AppShell></ProtectedRoute>} />
<Route path="/parametres" element={<ProtectedRoute><AppShell><Parametres /></AppShell></ProtectedRoute>} />
<Route path="/aide" element={<ProtectedRoute><AppShell><Aide /></AppShell></ProtectedRoute>} />


      {/* Redirection par défaut */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}