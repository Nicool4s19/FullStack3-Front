import { useState } from "react"
import { permisos } from "../auth/roles"

const icons = {
  "Gestión de usuarios": "👥",
  Cursos: "📚",
  "Ficha alumno": "🎓",
  Mensajería: "💬",
  Calendario: "📅",
  Anotaciones: "📝",
}

function Dashboard({ user, onLogout }) {
  const modulos = permisos[user.role] || []
  const [activeModule, setActiveModule] = useState(modulos[0] || "Inicio")

  return (
    <main className="dashboard">
      <aside className="sidebar">
        <h2>Portal Escolar</h2>

        <div className="user-box">
          <strong>{user.nombre || user.email}</strong>
          <span>{user.role}</span>
        </div>

        <nav>
          {modulos.map((modulo) => (
            <button
              key={modulo}
              className={activeModule === modulo ? "nav-item active" : "nav-item"}
              onClick={() => setActiveModule(modulo)}
            >
              <span>{icons[modulo] || "📌"}</span>
              {modulo}
            </button>
          ))}
        </nav>

        <button className="logout" onClick={onLogout}>
          Cerrar sesión
        </button>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <span className="badge">Panel {user.role}</span>
            <h1>{activeModule}</h1>
            <p>Bienvenido/a, {user.nombre || user.email}</p>
          </div>
        </header>

        <section className="stats-grid">
          <article>
            <strong>{modulos.length}</strong>
            <span>Módulos disponibles</span>
          </article>

          <article>
            <strong>{user.role}</strong>
            <span>Rol actual</span>
          </article>

          <article>
            <strong>Activo</strong>
            <span>Estado de sesión</span>
          </article>
        </section>

        <ModuleContent moduleName={activeModule} role={user.role} />
      </section>
    </main>
  )
}

function ModuleContent({ moduleName, role }) {
  const data = {
    Cursos: ["Desarrollo Fullstack III", "Base de Datos", "Arquitectura de Software"],
    "Ficha alumno": ["Nicolás Monsálvez", "Camila Rojas", "Matías Soto"],
    Anotaciones: ["Atraso registrado", "Felicitación académica", "Citación pendiente"],
    Calendario: ["Presentación final", "Reunión apoderado", "Entrega informe"],
    Mensajería: ["Mensaje de coordinación", "Aviso de reunión", "Consulta académica"],
    "Gestión de usuarios": ["Administrador", "Docente", "Apoderado", "Estudiante"],
  }

  return (
    <section className="module-panel">
      <div className="panel-header">
        <div>
          <h2>{moduleName}</h2>
          <p>Módulo habilitado para el rol <strong>{role}</strong>.</p>
        </div>

        <button>Nuevo registro</button>
      </div>

      <div className="table-card">
        {data[moduleName]?.map((item, index) => (
          <div className="table-row" key={item}>
            <span>{index + 1}</span>
            <strong>{item}</strong>
            <small>Disponible</small>
            <button>Ver detalle</button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Dashboard