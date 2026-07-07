import { permisos } from "../auth/roles"

function Dashboard({ user, onLogout }) {
  const modulos = permisos[user.role] || []

  return (
    <main className="dashboard">

      <aside className="sidebar">

        <h2>🎓 EduGestion</h2>

        <div className="user-box">
          <strong>
            {user.nombre || user.email}
          </strong>

          <span>{user.role}</span>
        </div>

        <nav>
          {modulos.map((modulo) => (
            <a href="#" key={modulo}>
              {modulo}
            </a>
          ))}
        </nav>

        <button
          className="logout"
          onClick={onLogout}
        >
          Cerrar Sesión
        </button>

      </aside>

      <section className="content">

        <header className="topbar">

          <div>
            <h1>Panel Principal</h1>

            <p>
              Bienvenido,
              {" "}
              {user.nombre || user.email}
            </p>
          </div>

          {user.role === "Administrador" && (
            <button className="admin-button">
              ➕ Crear Usuario
            </button>
          )}

        </header>

        <section className="cards-grid">

          {modulos.map((modulo) => (
            <article
              className="module-card"
              key={modulo}
            >
              <h3>{modulo}</h3>

              <p>
                Módulo disponible para el rol{" "}
                <strong>{user.role}</strong>
              </p>

              <button>
                Ingresar
              </button>

            </article>
          ))}

        </section>

      </section>

    </main>
  )
}

export default Dashboard