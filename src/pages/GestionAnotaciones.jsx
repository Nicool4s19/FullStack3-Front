import { Link } from "react-router-dom"

function GestionAnotaciones() {
  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Gestión de Anotaciones</h1>
          <p>Administrar anotaciones y bitácoras de estudiantes.</p>
        </div>

        <Link className="back-button" to="/">
          Volver
        </Link>
      </header>

      <section className="admin-table-card">
        <h2>Módulo de anotaciones</h2>
        <p>Ahora conectaremos este módulo con el microservicio de bitácora.</p>
      </section>
    </main>
  )
}

export default GestionAnotaciones