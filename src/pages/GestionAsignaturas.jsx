import { Link } from "react-router-dom"

function GestionAsignaturas() {
  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Gestión de Asignaturas</h1>
          <p>Administrar asignaturas y relaciones académicas.</p>
        </div>

        <Link className="back-button" to="/">
          Volver
        </Link>
      </header>

      <section className="admin-table-card">
        <h2>Módulo de asignaturas</h2>
        <p>Ahora conectaremos este módulo con el microservicio de asignaturas.</p>
      </section>
    </main>
  )
}

export default GestionAsignaturas