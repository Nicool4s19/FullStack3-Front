import { Link } from "react-router-dom"
import {
  Home,
  LogOut,
  Search,
  UserPlus,
} from "lucide-react"

import {
  getModulesForRole,
  getRoleLabel,
  canCreateUsers,
} from "../auth/roles"

function Dashboard({ user, onLogout }) {
  const modulosDisponibles = getModulesForRole(user?.role)
  const rolVisible = getRoleLabel(user?.role)
  const nombreUsuario = user?.nombre || user?.email || "Usuario"

  return (
    <main className="dashboard">
      <aside className="sidebar">
        <div className="logo-box">
          <Home size={34} />

          <div>
            <h2>EduGestion</h2>
            <span>Sistema Escolar</span>
          </div>
        </div>

        <div className="user-box">
          <div className="avatar-circle">
            {nombreUsuario.charAt(0).toUpperCase()}
          </div>

          <div className="user-info">
            <h3>{nombreUsuario}</h3>
            <p>{rolVisible}</p>
          </div>
        </div>

        <nav>
          {modulosDisponibles.map((modulo) => {
            const Icono = modulo.icono

            return (
              <Link key={modulo.id} to={modulo.ruta}>
                <Icono size={20} />
                {modulo.nombre}
              </Link>
            )
          })}
        </nav>

        <button className="logout" type="button" onClick={onLogout}>
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </aside>

      <section className="content">
        <header className="dashboard-header">
          <div>
            <h1>Panel {rolVisible}</h1>

            <p>
              Bienvenido <strong>{nombreUsuario}</strong>. Solo verás los módulos
              permitidos para tu rol.
            </p>
          </div>

          <div className="header-actions">
            <div className="search-box">
              <Search size={18} />
              <input placeholder="Buscar módulo..." />
            </div>

            {canCreateUsers(user?.role) && (
              <Link className="admin-button" to="/admin/usuarios">
                <UserPlus size={18} />
                Nuevo Usuario
              </Link>
            )}
          </div>
        </header>

        <section className="stats-grid">
          {modulosDisponibles.slice(0, 4).map((modulo) => {
            const Icono = modulo.icono

            return (
              <div className="stat-card" key={modulo.id}>
                <Icono size={28} />
                <h3>{modulo.resumen}</h3>
                <span>Disponible</span>
              </div>
            )
          })}
        </section>

        <section className="cards-grid">
          {modulosDisponibles.map((modulo) => {
            const Icono = modulo.icono

            return (
              <article className="module-card" key={modulo.id}>
                <div className="module-icon">
                  <Icono size={28} />
                </div>

                <h3>{modulo.nombre}</h3>
                <p>{modulo.descripcion}</p>

                <Link className="module-button" to={modulo.ruta}>
                  Abrir módulo
                </Link>
              </article>
            )
          })}
        </section>
      </section>
    </main>
  )
}

export default Dashboard