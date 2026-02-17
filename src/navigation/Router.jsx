import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import Welcome from "../screens/Welcome";
import Accueil from "../screens/TableauDeBord/Accueil";
import MesChemins from "../screens/TableauDeBord/MesChemins";
import Favoris from "../screens/TableauDeBord/Favoris";
import Profil from "../screens/TableauDeBord/Profil";
import SharePathScreen from "../screens/TableauDeBord/SharePathScreen";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />

      <Route
        path="/app"
        element={
          <AppShell>
            <Accueil />
          </AppShell>
        }
      />
      <Route
        path="/mes-chemins"
        element={
          <AppShell>
            <MesChemins />
          </AppShell>
        }
      />
      <Route
        path="/favoris"
        element={
          <AppShell>
            <Favoris />
          </AppShell>
        }
      />
      <Route
        path="/profil"
        element={
          <AppShell>
            <Profil />
          </AppShell>
        }
      />

     <Route
  path="/share/:share_token"
  element={
    <AppShell compact>
      <SharePathScreen />
    </AppShell>
  }
/>


      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
