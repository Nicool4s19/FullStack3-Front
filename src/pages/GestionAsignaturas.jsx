import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  listarAsignaturas,
  crearAsignatura,
  eliminarAsignatura,
} from "../services/asignaturaService"

const asignaturaInicial = {
  nombre: "",
  codigo: "",
  descripcion: "",
}

function GestionAsignaturas() {
  const [asignaturas, setAsignaturas] = useState([])
  const [form, setForm] = useState(asignaturaInicial)
  const [busqueda, setBusqueda] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [cargando, setCargando] = useState(false)
  const [guardando, setGuardando] = useState(false)

  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [asignaturaAEliminar, setAsignaturaAEliminar] = useState(null)

  const cargarAsignaturas = useCallback(async () => {
    try {
      setCargando(true)

      const { data } = await listarAsignaturas()

      setAsignaturas(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error al cargar asignaturas:", error)
      setMensaje("Error al cargar asignaturas")
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargarAsignaturas()
  }, [cargarAsignaturas])

  function obtenerMensajeError(error) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      JSON.stringify(error.response?.data) ||
      error.message ||
      "Error desconocido"
    )
  }

  function handleChange(e) {
    const { name, value } = e.target

    setForm({
      ...form,
      [name]: value,
    })
  }

  function limpiarFormulario() {
    setForm(asignaturaInicial)
  }

  function abrirFormulario() {
    limpiarFormulario()
    setMostrarFormulario(true)
  }

  function cerrarFormulario() {
    limpiarFormulario()
    setMostrarFormulario(false)
  }

  async function guardarAsignatura(e) {
    e.preventDefault()

    const payload = {
      nombre: form.nombre.trim(),
      codigo: form.codigo.trim(),
      descripcion: form.descripcion.trim(),
    }

    try {
      setGuardando(true)
      setMensaje("")

      await crearAsignatura(payload)

      setMensaje("Asignatura creada correctamente")
      limpiarFormulario()
      setMostrarFormulario(false)
      await cargarAsignaturas()
    } catch (error) {
      setMensaje(`Error al crear asignatura: ${obtenerMensajeError(error)}`)
    } finally {
      setGuardando(false)
    }
  }

  function solicitarEliminarAsignatura(asignatura) {
    setAsignaturaAEliminar(asignatura)
  }

  function cancelarEliminarAsignatura() {
    setAsignaturaAEliminar(null)
  }

  async function confirmarEliminarAsignatura() {
    if (!asignaturaAEliminar) return

    try {
      setMensaje("")

      await eliminarAsignatura(asignaturaAEliminar.idAsignatura)

      setMensaje("Asignatura eliminada correctamente")
      setAsignaturaAEliminar(null)
      await cargarAsignaturas()
    } catch (error) {
      setMensaje(`Error al eliminar asignatura: ${obtenerMensajeError(error)}`)
    }
  }

  const asignaturasFiltradas = asignaturas.filter((asignatura) => {
    const texto = [
      asignatura.idAsignatura,
      asignatura.nombre,
      asignatura.codigo,
      asignatura.descripcion,
    ]
      .join(" ")
      .toLowerCase()

    return texto.includes(busqueda.toLowerCase())
  })

  return (
    <main className="admin-page">

      <header className="admin-header">

        <div>
          <span className="page-tag">
            PANEL ADMINISTRATIVO
          </span>

          <h1>📖 Gestión de Asignaturas</h1>

          <p>
            Administra las asignaturas, códigos y descripciones del sistema.
          </p>
        </div>

        <div className="header-buttons">

          <button
            className="new-user-btn"
            type="button"
            onClick={abrirFormulario}
          >
            ➕ Nueva Asignatura
          </button>

          <Link className="back-button" to="/">
            ⬅ Dashboard
          </Link>

        </div>

      </header>

      {mensaje && (
        <div
          className={
            mensaje.toLowerCase().includes("error")
              ? "alert alert-error"
              : "alert alert-success"
          }
        >
          <span>
            {mensaje.toLowerCase().includes("error") ? "⚠️" : "✅"}
          </span>

          <p>{mensaje}</p>
        </div>
      )}

      <section className="users-summary-grid">

        <article className="users-summary-card">
          <span>📖</span>
          <div>
            <h3>{asignaturas.length}</h3>
            <p>Total asignaturas</p>
          </div>
        </article>

        <article className="users-summary-card">
          <span>🔎</span>
          <div>
            <h3>{asignaturasFiltradas.length}</h3>
            <p>Resultados</p>
          </div>
        </article>

        <article className="users-summary-card">
          <span>🏷️</span>
          <div>
            <h3>
              {asignaturas.filter((a) => a.codigo).length}
            </h3>
            <p>Con código</p>
          </div>
        </article>

        <article className="users-summary-card">
          <span>✅</span>
          <div>
            <h3>
              {asignaturas.filter((a) => a.descripcion).length}
            </h3>
            <p>Con descripción</p>
          </div>
        </article>

      </section>

      {mostrarFormulario && (
        <div className="modal-overlay">

          <section className="admin-form-card modal-card small-modal-card">

            <button
              className="modal-close"
              type="button"
              onClick={cerrarFormulario}
            >
              ✕
            </button>

            <div className="form-title-box">

              <span className="page-tag">
                NUEVA ASIGNATURA
              </span>

              <h2>Crear nueva asignatura</h2>

              <p>
                Completa los datos para registrar una asignatura en el sistema.
              </p>

            </div>

            <form className="user-form" onSubmit={guardarAsignatura}>

              <label className="form-field">
                <span>Nombre de la asignatura</span>
                <input
                  name="nombre"
                  placeholder="Ej: Matemáticas"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="form-field">
                <span>Código</span>
                <input
                  name="codigo"
                  placeholder="Ej: MAT-101"
                  value={form.codigo}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="form-field full-width">
                <span>Descripción</span>
                <input
                  name="descripcion"
                  placeholder="Descripción de la asignatura"
                  value={form.descripcion}
                  onChange={handleChange}
                  required
                />
              </label>

              <div className="form-actions full-width">

                <button
                  className="save-user-btn"
                  type="submit"
                  disabled={guardando}
                >
                  {guardando ? "Guardando..." : "Crear asignatura"}
                </button>

                <button
                  className="cancel-user-btn"
                  type="button"
                  onClick={cerrarFormulario}
                >
                  Cancelar
                </button>

              </div>

            </form>

          </section>

        </div>
      )}

      <section className="admin-table-card">

        <div className="table-header">

          <div>
            <span className="page-tag">ASIGNATURAS</span>

            <h2>Asignaturas registradas</h2>

            <p>
              Total encontradas: <strong>{asignaturasFiltradas.length}</strong>
            </p>
          </div>

          <div className="table-tools">

            <div className="search-container">

              <input
                className="search-input"
                type="text"
                placeholder="🔍 Buscar por nombre, código o descripción..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />

            </div>

          </div>

        </div>

        {cargando ? (
          <div className="loading-box">
            Cargando asignaturas...
          </div>
        ) : (
          <div className="table-responsive">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Asignatura</th>
                  <th>Código</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {asignaturasFiltradas.map((asignatura) => (
                  <tr key={asignatura.idAsignatura}>

                    <td>
                      <span className="id-badge">
                        #{asignatura.idAsignatura}
                      </span>
                    </td>

                    <td>
                      <div className="course-title-cell">

                        <div className="subject-avatar">
                          📖
                        </div>

                        <strong>
                          {asignatura.nombre}
                        </strong>

                      </div>
                    </td>

                    <td>
                      <span className="subject-code-badge">
                        {asignatura.codigo}
                      </span>
                    </td>

                    <td>
                      <span className="description-cell">
                        {asignatura.descripcion}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">

                        <button
                          className="delete-btn"
                          type="button"
                          onClick={() => solicitarEliminarAsignatura(asignatura)}
                        >
                          Eliminar
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}

                {asignaturasFiltradas.length === 0 && (
                  <tr>
                    <td colSpan="5" className="empty-table">
                      No hay asignaturas disponibles
                    </td>
                  </tr>
                )}
              </tbody>

            </table>

          </div>
        )}

      </section>

      {asignaturaAEliminar && (
        <div className="modal-overlay">

          <section className="confirm-modal">

            <div className="confirm-icon">
              ⚠️
            </div>

            <h2>Eliminar asignatura</h2>

            <p>
              ¿Seguro que deseas eliminar{" "}
              <strong>
                {asignaturaAEliminar.nombre}
              </strong>
              ?
            </p>

            <div className="confirm-actions">

              <button
                className="cancel-delete-btn"
                type="button"
                onClick={cancelarEliminarAsignatura}
              >
                Cancelar
              </button>

              <button
                className="confirm-delete-btn"
                type="button"
                onClick={confirmarEliminarAsignatura}
              >
                Sí, eliminar
              </button>

            </div>

          </section>

        </div>
      )}

    </main>
  )
}

export default GestionAsignaturas