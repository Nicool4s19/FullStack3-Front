import { Link } from "react-router-dom"

function MiFicha({ user }) {
  const nombreUsuario = user?.nombre || user?.email || "Alumno"

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <span className="page-tag">FICHA ALUMNO</span>
          <h1>🎓 Ficha del alumno</h1>
          <p>Vista de información académica asociada al estudiante.</p>
        </div>

        <div className="header-buttons">
          <Link className="back-button" to="/">
            ⬅ Dashboard
          </Link>
        </div>
      </header>

      <section className="admin-table-card">
        <div className="table-header">
          <div>
            <span className="page-tag">INFORMACIÓN</span>
            <h2>{nombreUsuario}</h2>
            <p>
              Aquí puedes mostrar datos del alumno, curso, apoderado, notas,
              asistencia o anotaciones cuando tu backend tenga ese endpoint.
            </p>
          </div>
        </div>

        <div className="users-summary-grid">
          <article className="users-summary-card">
            <span>📚</span>
            <div>
              <h3>Curso</h3>
              <p>Pendiente de conectar</p>
            </div>
          </article>

          <article className="users-summary-card">
            <span>📝</span>
            <div>
              <h3>Notas</h3>
              <p>Pendiente de conectar</p>
            </div>
          </article>

          <article className="users-summary-card">
            <span>📅</span>
            <div>
              <h3>Asistencia</h3>
              <p>Pendiente de conectar</p>
            </div>
          </article>

          <article className="users-summary-card">
            <span>👨‍👩‍👧</span>
            <div>
              <h3>Apoderado</h3>
              <p>Pendiente de conectar</p>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}

export default MiFicha