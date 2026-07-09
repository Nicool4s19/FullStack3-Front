import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  listarMural,
  crearMural,
  listarCalendarioPortal,
  crearEventoPortal,
} from "../services/portalService"

const muralInicial = {
  titulo: "",
  contenido: "",
  autor: "",
}

const eventoInicial = {
  evento: "",
  descripcion: "",
  fechaInicio: "",
  fechaFin: "",
  categoria: "",
}

function GestionPortal() {
  const [mural, setMural] = useState([])
  const [eventos, setEventos] = useState([])

  const [formMural, setFormMural] = useState(muralInicial)
  const [formEvento, setFormEvento] = useState(eventoInicial)

  const [busqueda, setBusqueda] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [cargando, setCargando] = useState(false)
  const [guardando, setGuardando] = useState(false)

  const [mostrarMural, setMostrarMural] = useState(false)
  const [mostrarEvento, setMostrarEvento] = useState(false)

  function obtenerMensajeError(error) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      JSON.stringify(error.response?.data) ||
      error.message ||
      "Error desconocido"
    )
  }

  const cargarMural = useCallback(async () => {
    const { data } = await listarMural()
    setMural(Array.isArray(data) ? data : [])
  }, [])

  const cargarEventos = useCallback(async () => {
    const { data } = await listarCalendarioPortal()
    setEventos(Array.isArray(data) ? data : [])
  }, [])

  const cargarDatos = useCallback(async () => {
    try {
      setCargando(true)

      await Promise.all([
        cargarMural(),
        cargarEventos(),
      ])
    } catch (error) {
      setMensaje(`Error al cargar portal: ${obtenerMensajeError(error)}`)
    } finally {
      setCargando(false)
    }
  }, [cargarMural, cargarEventos])

  useEffect(() => {
    cargarDatos()
  }, [cargarDatos])

  function handleMuralChange(e) {
    const { name, value } = e.target

    setFormMural({
      ...formMural,
      [name]: value,
    })
  }

  function handleEventoChange(e) {
    const { name, value } = e.target

    setFormEvento({
      ...formEvento,
      [name]: value,
    })
  }

  function limpiarMural() {
    setFormMural(muralInicial)
  }

  function limpiarEvento() {
    setFormEvento(eventoInicial)
  }

  function abrirMural() {
    limpiarMural()
    setMostrarMural(true)
  }

  function cerrarMural() {
    limpiarMural()
    setMostrarMural(false)
  }

  function abrirEvento() {
    limpiarEvento()
    setMostrarEvento(true)
  }

  function cerrarEvento() {
    limpiarEvento()
    setMostrarEvento(false)
  }

  async function guardarPublicacion(e) {
    e.preventDefault()

    const payload = {
      titulo: formMural.titulo.trim(),
      contenido: formMural.contenido.trim(),
      autor: formMural.autor.trim(),
    }

    try {
      setGuardando(true)
      setMensaje("")

      await crearMural(payload)

      setMensaje("Publicación creada correctamente")
      limpiarMural()
      setMostrarMural(false)
      await cargarMural()
    } catch (error) {
      setMensaje(`Error al crear publicación: ${obtenerMensajeError(error)}`)
    } finally {
      setGuardando(false)
    }
  }

  async function guardarEvento(e) {
    e.preventDefault()

    const payload = {
      evento: formEvento.evento.trim(),
      descripcion: formEvento.descripcion.trim(),
      fechaInicio: formEvento.fechaInicio,
      fechaFin: formEvento.fechaFin || null,
      categoria: formEvento.categoria.trim(),
    }

    try {
      setGuardando(true)
      setMensaje("")

      await crearEventoPortal(payload)

      setMensaje("Evento creado correctamente")
      limpiarEvento()
      setMostrarEvento(false)
      await cargarEventos()
    } catch (error) {
      setMensaje(`Error al crear evento: ${obtenerMensajeError(error)}`)
    } finally {
      setGuardando(false)
    }
  }

  function fechaVisible(fecha) {
    if (!fecha) return "Sin fecha"

    const fechaConvertida = new Date(`${fecha}T00:00:00`)

    if (Number.isNaN(fechaConvertida.getTime())) {
      return fecha
    }

    return fechaConvertida.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  const textoBusqueda = busqueda.toLowerCase()

  const muralFiltrado = mural.filter((item) =>
    [
      item.id,
      item.titulo,
      item.contenido,
      item.fechaPublicacion,
      item.autor,
    ]
      .join(" ")
      .toLowerCase()
      .includes(textoBusqueda)
  )

  const eventosFiltrados = eventos.filter((item) =>
    [
      item.id,
      item.evento,
      item.descripcion,
      item.fechaInicio,
      item.fechaFin,
      item.categoria,
    ]
      .join(" ")
      .toLowerCase()
      .includes(textoBusqueda)
  )

  return (
    <main className="admin-page">

      <header className="admin-header">

        <div>
          <span className="page-tag">
            PANEL ADMINISTRATIVO
          </span>

          <h1>📰 Portal Informativo</h1>

          <p>
            Administra publicaciones del mural digital y eventos del calendario estudiantil.
          </p>
        </div>

        <div className="header-buttons">

          <button
            className="new-user-btn"
            type="button"
            onClick={abrirMural}
          >
            ➕ Nueva Publicación
          </button>

          <button
            className="new-user-btn"
            type="button"
            onClick={abrirEvento}
          >
            ➕ Nuevo Evento
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
          <span>📰</span>
          <div>
            <h3>{mural.length}</h3>
            <p>Publicaciones</p>
          </div>
        </article>

        <article className="users-summary-card">
          <span>📅</span>
          <div>
            <h3>{eventos.length}</h3>
            <p>Eventos</p>
          </div>
        </article>

        <article className="users-summary-card">
          <span>🔎</span>
          <div>
            <h3>{muralFiltrado.length + eventosFiltrados.length}</h3>
            <p>Resultados</p>
          </div>
        </article>

        <article className="users-summary-card">
          <span>🏷️</span>
          <div>
            <h3>{eventos.filter((e) => e.categoria).length}</h3>
            <p>Categorías</p>
          </div>
        </article>

      </section>

      <section className="admin-table-card">

        <div className="table-header">

          <div>
            <span className="page-tag">BUSCADOR</span>

            <h2>Buscar registros</h2>

            <p>
              Publicaciones: <strong>{muralFiltrado.length}</strong> | Eventos:{" "}
              <strong>{eventosFiltrados.length}</strong>
            </p>
          </div>

          <div className="table-tools">

            <div className="search-container">

              <input
                className="search-input"
                type="text"
                placeholder="🔍 Buscar publicación, evento, autor, categoría o fecha..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />

            </div>

          </div>

        </div>

      </section>

      {mostrarMural && (
        <div className="modal-overlay">

          <section className="admin-form-card modal-card small-modal-card">

            <button
              className="modal-close"
              type="button"
              onClick={cerrarMural}
            >
              ✕
            </button>

            <div className="form-title-box">

              <span className="page-tag">
                NUEVA PUBLICACIÓN
              </span>

              <h2>Crear publicación en mural</h2>

              <p>
                Publica información importante para la comunidad escolar.
              </p>

            </div>

            <form className="user-form" onSubmit={guardarPublicacion}>

              <label className="form-field">
                <span>Título</span>
                <input
                  name="titulo"
                  placeholder="Título"
                  value={formMural.titulo}
                  onChange={handleMuralChange}
                  required
                  maxLength="150"
                />
              </label>

              <label className="form-field">
                <span>Autor</span>
                <input
                  name="autor"
                  placeholder="Autor"
                  value={formMural.autor}
                  onChange={handleMuralChange}
                  required
                  maxLength="100"
                />
              </label>

              <label className="form-field full-width">
                <span>Contenido</span>
                <textarea
                  name="contenido"
                  placeholder="Contenido de la publicación..."
                  value={formMural.contenido}
                  onChange={handleMuralChange}
                  required
                />
              </label>

              <div className="form-actions full-width">

                <button
                  className="save-user-btn"
                  type="submit"
                  disabled={guardando}
                >
                  {guardando ? "Guardando..." : "Crear publicación"}
                </button>

                <button
                  className="cancel-user-btn"
                  type="button"
                  onClick={cerrarMural}
                >
                  Cancelar
                </button>

              </div>

            </form>

          </section>

        </div>
      )}

      {mostrarEvento && (
        <div className="modal-overlay">

          <section className="admin-form-card modal-card small-modal-card">

            <button
              className="modal-close"
              type="button"
              onClick={cerrarEvento}
            >
              ✕
            </button>

            <div className="form-title-box">

              <span className="page-tag">
                NUEVO EVENTO
              </span>

              <h2>Crear evento calendario</h2>

              <p>
                Agrega una actividad o fecha importante al calendario estudiantil.
              </p>

            </div>

            <form className="user-form" onSubmit={guardarEvento}>

              <label className="form-field">
                <span>Nombre del evento</span>
                <input
                  name="evento"
                  placeholder="Nombre del evento"
                  value={formEvento.evento}
                  onChange={handleEventoChange}
                  required
                  maxLength="100"
                />
              </label>

              <label className="form-field">
                <span>Categoría</span>
                <input
                  name="categoria"
                  placeholder="Ej: Académico"
                  value={formEvento.categoria}
                  onChange={handleEventoChange}
                  required
                  maxLength="50"
                />
              </label>

              <label className="form-field">
                <span>Fecha inicio</span>
                <input
                  name="fechaInicio"
                  type="date"
                  value={formEvento.fechaInicio}
                  onChange={handleEventoChange}
                  required
                />
              </label>

              <label className="form-field">
                <span>Fecha fin</span>
                <input
                  name="fechaFin"
                  type="date"
                  value={formEvento.fechaFin}
                  onChange={handleEventoChange}
                />
              </label>

              <label className="form-field full-width">
                <span>Descripción</span>
                <textarea
                  name="descripcion"
                  placeholder="Descripción del evento..."
                  value={formEvento.descripcion}
                  onChange={handleEventoChange}
                />
              </label>

              <div className="form-actions full-width">

                <button
                  className="save-user-btn"
                  type="submit"
                  disabled={guardando}
                >
                  {guardando ? "Guardando..." : "Crear evento"}
                </button>

                <button
                  className="cancel-user-btn"
                  type="button"
                  onClick={cerrarEvento}
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
            <span className="page-tag">MURAL DIGITAL</span>

            <h2>Publicaciones del portal</h2>

            <p>
              Total: <strong>{muralFiltrado.length}</strong>
            </p>
          </div>
        </div>

        {cargando ? (
          <div className="loading-box">
            Cargando...
          </div>
        ) : (
          <div className="portal-grid">

            {muralFiltrado.map((item) => (
              <article className="portal-post-card" key={item.id}>

                <div className="portal-post-icon">
                  📰
                </div>

                <div className="portal-post-content">

                  <span className="id-badge">
                    #{item.id}
                  </span>

                  <h3>{item.titulo}</h3>

                  <p>{item.contenido}</p>

                  <div className="portal-post-footer">

                    <span>
                      ✍️ {item.autor}
                    </span>

                    <span>
                      📅 {fechaVisible(item.fechaPublicacion)}
                    </span>

                  </div>

                </div>

              </article>
            ))}

            {muralFiltrado.length === 0 && (
              <div className="empty-calendar">
                No hay publicaciones disponibles
              </div>
            )}

          </div>
        )}

      </section>

      <section className="admin-table-card">

        <div className="table-header">
          <div>
            <span className="page-tag">CALENDARIO ESTUDIANTIL</span>

            <h2>Eventos del portal</h2>

            <p>
              Total: <strong>{eventosFiltrados.length}</strong>
            </p>
          </div>
        </div>

        <div className="table-responsive">

          <table className="admin-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Evento</th>
                <th>Descripción</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Categoría</th>
              </tr>
            </thead>

            <tbody>
              {eventosFiltrados.map((item) => (
                <tr key={item.id}>

                  <td>
                    <span className="id-badge">
                      #{item.id}
                    </span>
                  </td>

                  <td>
                    <div className="portal-event-cell">

                      <div className="portal-event-avatar">
                        📅
                      </div>

                      <strong>{item.evento}</strong>

                    </div>
                  </td>

                  <td>
                    <span className="description-cell">
                      {item.descripcion || "Sin descripción"}
                    </span>
                  </td>

                  <td>
                    <span className="portal-date-badge">
                      {fechaVisible(item.fechaInicio)}
                    </span>
                  </td>

                  <td>
                    <span className="portal-date-badge">
                      {fechaVisible(item.fechaFin)}
                    </span>
                  </td>

                  <td>
                    <span className="portal-category-badge">
                      {item.categoria}
                    </span>
                  </td>

                </tr>
              ))}

              {eventosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-table">
                    No hay eventos disponibles
                  </td>
                </tr>
              )}
            </tbody>

          </table>

        </div>

      </section>

    </main>
  )
}

export default GestionPortal