import './App.css'

function App() {
  return (
    <main className="app">
      <nav className="navbar">
        <h2>EduGestión</h2>
        <div>
          <a href="#modulos">Módulos</a>
          <a href="#panel">Panel</a>
          <a href="#contacto">Contacto</a>
        </div>
      </nav>

      <section className="hero">
        <div className="heroText">
          <span className="badge">Sistema académico fullstack</span>
          <h1>Gestiona alumnos, cursos y anotaciones en un solo lugar</h1>
          <p>
            Plataforma moderna para apoyar la gestión escolar con módulos
            organizados, interfaz clara y preparada para integrarse con backend.
          </p>

          <div className="actions">
            <button>Comenzar</button>
            <button className="secondary">Ver módulos</button>
          </div>
        </div>

        <div className="heroCard">
          <h3>Resumen del sistema</h3>
          <div className="stat">
            <span>Alumnos activos</span>
            <strong>128</strong>
          </div>
          <div className="stat">
            <span>Cursos</span>
            <strong>8</strong>
          </div>
          <div className="stat">
            <span>Anotaciones</span>
            <strong>34</strong>
          </div>
        </div>
      </section>

      <section id="modulos" className="modules">
        <h2>Módulos principales</h2>

        <div className="grid">
          <article className="card">
            <h3>Ficha alumno</h3>
            <p>Registro y visualización de información académica del estudiante.</p>
          </article>

          <article className="card">
            <h3>Gestión de usuarios</h3>
            <p>Administración de roles, permisos y acceso seguro al sistema.</p>
          </article>

          <article className="card">
            <h3>Anotaciones</h3>
            <p>Seguimiento de observaciones, historial y reportes del alumno.</p>
          </article>

          <article className="card">
            <h3>Calendario</h3>
            <p>Organización de reuniones, citaciones y actividades académicas.</p>
          </article>
        </div>
      </section>
    </main>
  )
}

export default App