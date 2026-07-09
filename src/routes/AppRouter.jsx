import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"

import Dashboard from "../pages/Dashboard"
import AccesoDenegado from "../pages/AccesoDenegado"
import MiFicha from "../pages/MiFicha"

import GestionUsuarios from "../pages/GestionUsuarios"
import GestionCursos from "../pages/GestionCursos"
import GestionAsignaturas from "../pages/GestionAsignaturas"
import GestionMensajes from "../pages/GestionMensajes"
import GestionAnotaciones from "../pages/GestionAnotaciones"
import GestionCalendario from "../pages/GestionCalendario"
import GestionReuniones from "../pages/GestionReuniones"
import GestionPortal from "../pages/GestionPortal"

import { canAccessPath } from "../auth/roles"

function RutaProtegida({ user, path, children }) {
  if (!canAccessPath(user?.role, path)) {
    return <AccesoDenegado user={user} />
  }

  return children
}

function AppRouter({ user, onLogout }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Dashboard user={user} onLogout={onLogout} />}
        />

        <Route
          path="/admin"
          element={<Navigate to="/" replace />}
        />

        <Route
          path="/admin/usuarios"
          element={
            <RutaProtegida user={user} path="/admin/usuarios">
              <GestionUsuarios user={user} />
            </RutaProtegida>
          }
        />

        <Route
          path="/admin/cursos"
          element={
            <RutaProtegida user={user} path="/admin/cursos">
              <GestionCursos user={user} />
            </RutaProtegida>
          }
        />

        <Route
          path="/admin/asignaturas"
          element={
            <RutaProtegida user={user} path="/admin/asignaturas">
              <GestionAsignaturas user={user} />
            </RutaProtegida>
          }
        />

        <Route
          path="/admin/mensajes"
          element={
            <RutaProtegida user={user} path="/admin/mensajes">
              <GestionMensajes user={user} />
            </RutaProtegida>
          }
        />

        <Route
          path="/admin/anotaciones"
          element={
            <RutaProtegida user={user} path="/admin/anotaciones">
              <GestionAnotaciones user={user} />
            </RutaProtegida>
          }
        />

        <Route
          path="/admin/calendario"
          element={
            <RutaProtegida user={user} path="/admin/calendario">
              <GestionCalendario user={user} />
            </RutaProtegida>
          }
        />

        <Route
          path="/admin/reuniones"
          element={
            <RutaProtegida user={user} path="/admin/reuniones">
              <GestionReuniones user={user} />
            </RutaProtegida>
          }
        />

        <Route
          path="/admin/portal"
          element={
            <RutaProtegida user={user} path="/admin/portal">
              <GestionPortal user={user} />
            </RutaProtegida>
          }
        />

        <Route
          path="/mi-ficha"
          element={
            <RutaProtegida user={user} path="/mi-ficha">
              <MiFicha user={user} />
            </RutaProtegida>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter