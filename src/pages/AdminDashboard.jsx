import { Link } from "react-router-dom"

const modulosAdmin = [
  {
    nombre: "Gestión de usuarios",
    descripcion: "Crear, editar y eliminar usuarios.",
    ruta: "/admin/usuarios",
  },
  {
    nombre: "Cursos",
    descripcion: "Administrar cursos del sistema.",
    ruta: "/admin/cursos",
  },
  {
    nombre: "Asignaturas",
    descripcion: "Administrar asignaturas.",
    ruta: "/admin/asignaturas",
  },
  {
    nombre: "Mensajería",
    descripcion: "Revisar y administrar mensajes.",
    ruta: "/admin/mensajes",
  },
  {
    nombre: "Anotaciones",
    descripcion: "Gestionar anotaciones y bitácoras.",
    ruta: "/admin/anotaciones",
  },
  {
    nombre: "Calendario",
    descripcion: "Ver eventos y actividades.",
    ruta: "/admin/calendario",
  },
  {
  nombre: "Reuniones",
  descripcion: "Gestionar reuniones, citaciones y bitácora general.",
  ruta: "/admin/reuniones",
},
]

function AdminDashboard({ user, onLogout }) {
  return (
    <main className="dashboard">
      <aside className="sidebar">
        <h2>EduGestion Admin</h2>

        <div className="user-box">
          <strong>{user.nombre || user.email}</strong>
          <span>Administrador</span>
        </div>

        <nav>
          {modulosAdmin.map((modulo) => (
            <Link key={modulo.nombre} to={modulo.ruta}>
              {modulo.nombre}
            </Link>
          ))}
        </nav>

        <button className="logout" onClick={onLogout}>
          Cerrar Sesión
        </button>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <h1>Panel Administrador</h1>
            <p>Control total del sistema EduGestion.</p>
          </div>

          <Link className="admin-button" to="/admin/usuarios">
            Crear usuario
          </Link>
        </header>

        <section className="cards-grid">
          {modulosAdmin.map((modulo) => (
            <article className="module-card" key={modulo.nombre}>
              <h3>{modulo.nombre}</h3>

              <p>{modulo.descripcion}</p>

              <Link to={modulo.ruta}>
                Ingresar
              </Link>
            </article>
          ))}
        </section>
      </section>
    </main>
  )
}

export default AdminDashboard