import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  listarAsignaturas,
  listarAnotaciones,
  crearAnotacion,
  eliminarAnotacion,
} from "../services/asignaturaService"

const anotacionInicial = {
  estudiante: "",
  descripcion: "",
  idAsignatura: "",
}

function GestionAnotaciones() {
  const [anotaciones, setAnotaciones] = useState([])
  const [asignaturas, setAsignaturas] = useState([])
  const [form, setForm] = useState(anotacionInicial)
  const [busqueda, setBusqueda] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [cargando, setCargando] = useState(false)
  const [guardando, setGuardando] = useState(false)

  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [anotacionAEliminar, setAnotacionAEliminar] = useState(null)

  const cargarAnotaciones = useCallback(async () => {
    try {
      setCargando(true)

      const { data } = await listarAnotaciones()

      setAnotaciones(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error al cargar anotaciones:", error)
      setMensaje("Error al cargar anotaciones")
    } finally {
      setCargando(false)
    }
  }, [])

  const cargarAsignaturas = useCallback(async () => {
    try {
      const { data } = await listarAsignaturas()

      setAsignaturas(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error al cargar asignaturas:", error)
      setAsignaturas([])
    }
  }, [])

  useEffect(() => {
    async function cargarDatos() {
      await Promise.all([
        cargarAnotaciones(),
        cargarAsignaturas(),
      ])
    }

    cargarDatos()
  }, [cargarAnotaciones, cargarAsignaturas])

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
      [name]: name === "idAsignatura" ? Number(value) : value,
    })
  }

  function limpiarFormulario() {
    setForm(anotacionInicial)
  }

  function abrirFormulario() {
    limpiarFormulario()
    setMostrarFormulario(true)
  }

  function cerrarFormulario() {
    limpiarFormulario()
    setMostrarFormulario(false)
  }

  async function guardarAnotacion(e) {
    e.preventDefault()

    if (!form.idAsignatura) {
      setMensaje("Debes seleccionar una asignatura")
      return
    }

    const payload = {
      estudiante: form.estudiante.trim(),
      descripcion: form.descripcion.trim(),
      idAsignatura: Number(form.idAsignatura),
    }

    try {
      setGuardando(true)
      setMensaje("")

      await crearAnotacion(payload)

      setMensaje("Anotación creada correctamente")
      limpiarFormulario()
      setMostrarFormulario(false)
      await cargarAnotaciones()
    } catch (error) {
      setMensaje(`Error al crear anotación: ${obtenerMensajeError(error)}`)
    } finally {
      setGuardando(false)
    }
  }

  function solicitarEliminarAnotacion(anotacion) {
    setAnotacionAEliminar(anotacion)
  }

  function cancelarEliminarAnotacion() {
    setAnotacionAEliminar(null)
  }

  async function confirmarEliminarAnotacion() {
    if (!anotacionAEliminar) return

    try {
      setMensaje("")

      await eliminarAnotacion(anotacionAEliminar.idAnotacion)

      setMensaje("Anotación eliminada correctamente")
      setAnotacionAEliminar(null)
      await cargarAnotaciones()
    } catch (error) {
      setMensaje(`Error al eliminar anotación: ${obtenerMensajeError(error)}`)
    }
  }

  function obtenerNombreAsignatura(anotacion) {
    return (
      anotacion.asignatura?.nombre ||
      anotacion.asignatura?.codigo ||
      anotacion.idAsignatura ||
      "Sin asignatura"
    )
  }

  const anotacionesFiltradas = anotaciones.filter((anotacion) => {
    const texto = [
      anotacion.idAnotacion,
      anotacion.estudiante,
      anotacion.descripcion,
      anotacion.tipo,
      anotacion.fecha,
      obtenerNombreAsignatura(anotacion),
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

          <h1>📝 Gestión de Anotaciones</h1>

          <p>
            Administra observaciones, anotaciones y registros asociados a asignaturas.
          </p>
        </div>

        <div className="header-buttons">

          <button
            className="new-user-btn"
            type="button"
            onClick={abrirFormulario}
          >
            ➕ Nueva Anotación
          </button>

          <Link className="back-button" to="/">
            ⬅ Dashboard
          </Link>

        </div>

      </header>

      {mensaje && (
        <div
          className={
            mensaje.toLowerCase().includes("error") ||
            mensaje.toLowerCase().includes("debes")
              ? "alert alert-error"
              : "alert alert-success"
          }
        >
          <span>
            {mensaje.toLowerCase().includes("error") ||
            mensaje.toLowerCase().includes("debes")
              ? "⚠️"
              : "✅"}
          </span>

          <p>{mensaje}</p>
        </div>
      )}

      <section className="users-summary-grid">

        <article className="users-summary-card">
          <span>📝</span>
          <div>
            <h3>{anotaciones.length}</h3>
            <p>Total anotaciones</p>
          </div>
        </article>

        <article className="users-summary-card">
          <span>📖</span>
          <div>
            <h3>{asignaturas.length}</h3>
            <p>Asignaturas</p>
          </div>
        </article>

        <article className="users-summary-card">
          <span>🔎</span>
          <div>
            <h3>{anotacionesFiltradas.length}</h3>
            <p>Resultados</p>
          </div>
        </article>

        <article className="users-summary-card">
          <span>📅</span>
          <div>
            <h3>
              {anotaciones.filter((a) => a.fecha).length}
            </h3>
            <p>Con fecha</p>
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
                NUEVA ANOTACIÓN
              </span>

              <h2>Crear nueva anotación</h2>

              <p>
                Completa los datos del estudiante, la descripción y la asignatura.
              </p>

            </div>

            <form className="user-form" onSubmit={guardarAnotacion}>

              <label className="form-field">
                <span>Estudiante</span>
                <input
                  name="estudiante"
                  placeholder="Nombre del estudiante"
                  value={form.estudiante}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="form-field">
                <span>Asignatura</span>
                <select
                  name="idAsignatura"
                  value={form.idAsignatura}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    Selecciona asignatura
                  </option>

                  {asignaturas.map((asignatura) => (
                    <option
                      key={asignatura.idAsignatura}
                      value={asignatura.idAsignatura}
                    >
                      {asignatura.nombre} - {asignatura.codigo}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field full-width">
                <span>Descripción</span>
                <textarea
                  name="descripcion"
                  placeholder="Describe la anotación del estudiante..."
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
                  {guardando ? "Guardando..." : "Crear anotación"}
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
            <span className="page-tag">ANOTACIONES</span>

            <h2>Anotaciones registradas</h2>

            <p>
              Total encontradas: <strong>{anotacionesFiltradas.length}</strong>
            </p>
          </div>

          <div className="table-tools">

            <div className="search-container">

              <input
                className="search-input"
                type="text"
                placeholder="🔍 Buscar por estudiante, asignatura, fecha o descripción..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />

            </div>

          </div>

        </div>

        {cargando ? (
          <div className="loading-box">
            Cargando anotaciones...
          </div>
        ) : (
          <div className="table-responsive">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Estudiante</th>
                  <th>Descripción</th>
                  <th>Tipo</th>
                  <th>Fecha</th>
                  <th>Asignatura</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {anotacionesFiltradas.map((anotacion) => (
                  <tr key={anotacion.idAnotacion}>

                    <td>
                      <span className="id-badge">
                        #{anotacion.idAnotacion}
                      </span>
                    </td>

                    <td>
                      <div className="course-title-cell">

                        <div className="annotation-avatar">
                          {anotacion.estudiante?.charAt(0).toUpperCase() || "E"}
                        </div>

                        <strong>
                          {anotacion.estudiante}
                        </strong>

                      </div>
                    </td>

                    <td>
                      <span className="description-cell">
                        {anotacion.descripcion}
                      </span>
                    </td>

                    <td>
                      <span className="annotation-type-badge">
                        {anotacion.tipo || "Sin tipo"}
                      </span>
                    </td>

                    <td>
                      <span className="annotation-date-badge">
                        {anotacion.fecha || "Sin fecha"}
                      </span>
                    </td>

                    <td>
                      <span className="subject-code-badge">
                        {obtenerNombreAsignatura(anotacion)}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">

                        <button
                          className="delete-btn"
                          type="button"
                          onClick={() => solicitarEliminarAnotacion(anotacion)}
                        >
                          Eliminar
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}

                {anotacionesFiltradas.length === 0 && (
                  <tr>
                    <td colSpan="7" className="empty-table">
                      No hay anotaciones disponibles
                    </td>
                  </tr>
                )}
              </tbody>

            </table>

          </div>
        )}

      </section>

      {anotacionAEliminar && (
        <div className="modal-overlay">

          <section className="confirm-modal">

            <div className="confirm-icon">
              ⚠️
            </div>

            <h2>Eliminar anotación</h2>

            <p>
              ¿Seguro que deseas eliminar esta anotación de{" "}
              <strong>
                {anotacionAEliminar.estudiante}
              </strong>
              ?
            </p>

            <div className="confirm-actions">

              <button
                className="cancel-delete-btn"
                type="button"
                onClick={cancelarEliminarAnotacion}
              >
                Cancelar
              </button>

              <button
                className="confirm-delete-btn"
                type="button"
                onClick={confirmarEliminarAnotacion}
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

export default GestionAnotaciones