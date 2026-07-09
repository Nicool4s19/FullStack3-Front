import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"

import Dashboard from "../pages/Dashboard"
import AdminDashboard from "../pages/AdminDashboard"
import GestionUsuarios from "../pages/GestionUsuarios"
import GestionCursos from "../pages/GestionCursos"
import GestionAsignaturas from "../pages/GestionAsignaturas"
import GestionMensajes from "../pages/GestionMensajes"
import GestionAnotaciones from "../pages/GestionAnotaciones"
import GestionCalendario from "../pages/GestionCalendario"
import GestionReuniones from "../pages/GestionReuniones"
import GestionPortal from "../pages/GestionPortal"

function AppRouter({ user, onLogout }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            user.role === "ADMIN" ? (
              <AdminDashboard user={user} onLogout={onLogout} />
            ) : (
              <Dashboard user={user} onLogout={onLogout} />
            )
          }
        />

        <Route
          path="/admin"
          element={
            <AdminDashboard user={user} onLogout={onLogout} />
          }
        />

        <Route
          path="/admin/usuarios"
          element={<GestionUsuarios />}
        />

        <Route
          path="/admin/cursos"
          element={<GestionCursos />}
        />

        <Route
          path="/admin/asignaturas"
          element={<GestionAsignaturas />}
        />

        <Route
          path="/admin/mensajes"
          element={<GestionMensajes />}
        />

        <Route
          path="/admin/anotaciones"
          element={<GestionAnotaciones />}
        />

        <Route
          path="/admin/calendario"
          element={<GestionCalendario />}
        />

        <Route
          path="/admin/reuniones"
          element={<GestionReuniones />}
        />
        <Route
  path="/admin/portal"
  element={<GestionPortal />}
/>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter