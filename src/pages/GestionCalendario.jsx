import { Link } from "react-router-dom"

function GestionCalendario() {
  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Calendario</h1>
          <p>Eventos, actividades y fechas importantes.</p>
        </div>

        <Link className="back-button" to="/">
          Volver
        </Link>
      </header>

      <section className="admin-table-card">
        <h2>Módulo de calendario</h2>
        <p>Este módulo puede quedar como vista informativa si no hay microservicio.</p>
      </section>
    </main>
  )
}

export default GestionCalendario