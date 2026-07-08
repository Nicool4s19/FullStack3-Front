import { Link } from "react-router-dom"

function GestionMensajes() {
  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Gestión de Mensajería</h1>
          <p>Ver y administrar mensajes del sistema.</p>
        </div>

        <Link className="back-button" to="/">
          Volver
        </Link>
      </header>

      <section className="admin-table-card">
        <h2>Módulo de mensajería</h2>
        <p>Ahora conectaremos este módulo con el microservicio de mensajería.</p>
      </section>
    </main>
  )
}

export default GestionMensajes