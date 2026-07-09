import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  listarReuniones,
  crearReunion,
  actualizarReunion,
  eliminarReunion,
  listarCitaciones,
  crearCitacion,
  actualizarCitacion,
  eliminarCitacion,
  listarBitacorasGenerales,
  crearBitacoraGeneral,
  actualizarBitacoraGeneral,
  eliminarBitacoraGeneral,
} from "../services/reunionService"

const reunionInicial = {
  titulo: "",
  descripcion: "",
  encargado: "",
  fechaReunion: "",
}

const citacionInicial = {
  nombreApoderado: "",
  nombreEstudiante: "",
  motivo: "",
  fechaCitacion: "",
}

const bitacoraInicial = {
  tema: "",
  observacion: "",
  participantes: "",
}

function GestionReuniones() {
  const [reuniones, setReuniones] = useState([])
  const [citaciones, setCitaciones] = useState([])
  const [bitacoras, setBitacoras] = useState([])

  const [formReunion, setFormReunion] = useState(reunionInicial)
  const [formCitacion, setFormCitacion] = useState(citacionInicial)
  const [formBitacora, setFormBitacora] = useState(bitacoraInicial)

  const [editandoReunionId, setEditandoReunionId] = useState(null)
  const [editandoCitacionId, setEditandoCitacionId] = useState(null)
  const [editandoBitacoraId, setEditandoBitacoraId] = useState(null)

  const [busqueda, setBusqueda] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [cargando, setCargando] = useState(false)
  const [guardando, setGuardando] = useState(false)

  const [mostrarReunion, setMostrarReunion] = useState(false)
  const [mostrarCitacion, setMostrarCitacion] = useState(false)
  const [mostrarBitacora, setMostrarBitacora] = useState(false)
  const [itemAEliminar, setItemAEliminar] = useState(null)

  function normalizarFecha(fecha) {
    if (!fecha) return ""

    const fechaConvertida = new Date(fecha)

    return fechaConvertida.toISOString()
  }

  function fechaParaInput(fecha) {
    if (!fecha) return ""

    return fecha.slice(0, 16)
  }

  function fechaVisible(fecha) {
    if (!fecha) return "Sin fecha"

    const fechaConvertida = new Date(fecha)

    if (Number.isNaN(fechaConvertida.getTime())) {
      return fecha
    }

    return fechaConvertida.toLocaleString("es-CL", {
      dateStyle: "short",
      timeStyle: "short",
    })
  }

  function obtenerMensajeError(error) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      JSON.stringify(error.response?.data) ||
      error.message ||
      "Error desconocido"
    )
  }

  const cargarReuniones = useCallback(async () => {
    const { data } = await listarReuniones()
    setReuniones(Array.isArray(data) ? data : [])
  }, [])

  const cargarCitaciones = useCallback(async () => {
    const { data } = await listarCitaciones()
    setCitaciones(Array.isArray(data) ? data : [])
  }, [])

  const cargarBitacoras = useCallback(async () => {
    const { data } = await listarBitacorasGenerales()
    setBitacoras(Array.isArray(data) ? data : [])
  }, [])

  const cargarDatos = useCallback(async () => {
    try {
      setCargando(true)

      await Promise.all([
        cargarReuniones(),
        cargarCitaciones(),
        cargarBitacoras(),
      ])
    } catch (error) {
      setMensaje(`Error al cargar datos: ${obtenerMensajeError(error)}`)
    } finally {
      setCargando(false)
    }
  }, [cargarReuniones, cargarCitaciones, cargarBitacoras])

  useEffect(() => {
    cargarDatos()
  }, [cargarDatos])

  function handleReunionChange(e) {
    const { name, value } = e.target

    setFormReunion({
      ...formReunion,
      [name]: value,
    })
  }

  function handleCitacionChange(e) {
    const { name, value } = e.target

    setFormCitacion({
      ...formCitacion,
      [name]: value,
    })
  }

  function handleBitacoraChange(e) {
    const { name, value } = e.target

    setFormBitacora({
      ...formBitacora,
      [name]: value,
    })
  }

  function limpiarReunion() {
    setFormReunion(reunionInicial)
    setEditandoReunionId(null)
  }

  function limpiarCitacion() {
    setFormCitacion(citacionInicial)
    setEditandoCitacionId(null)
  }

  function limpiarBitacora() {
    setFormBitacora(bitacoraInicial)
    setEditandoBitacoraId(null)
  }

  function abrirNuevaReunion() {
    limpiarReunion()
    setMostrarReunion(true)
  }

  function cerrarReunion() {
    limpiarReunion()
    setMostrarReunion(false)
  }

  function abrirNuevaCitacion() {
    limpiarCitacion()
    setMostrarCitacion(true)
  }

  function cerrarCitacion() {
    limpiarCitacion()
    setMostrarCitacion(false)
  }

  function abrirNuevaBitacora() {
    limpiarBitacora()
    setMostrarBitacora(true)
  }

  function cerrarBitacora() {
    limpiarBitacora()
    setMostrarBitacora(false)
  }

  async function guardarReunion(e) {
    e.preventDefault()

    const payload = {
      titulo: formReunion.titulo.trim(),
      descripcion: formReunion.descripcion.trim(),
      encargado: formReunion.encargado.trim(),
      fechaReunion: normalizarFecha(formReunion.fechaReunion),
    }

    try {
      setGuardando(true)
      setMensaje("")

      if (editandoReunionId) {
        await actualizarReunion(editandoReunionId, payload)
        setMensaje("Reunión editada correctamente")
      } else {
        await crearReunion(payload)
        setMensaje("Reunión creada correctamente")
      }

      limpiarReunion()
      setMostrarReunion(false)
      await cargarReuniones()
    } catch (error) {
      setMensaje(`Error al guardar reunión: ${obtenerMensajeError(error)}`)
    } finally {
      setGuardando(false)
    }
  }

  function editarReunion(reunion) {
    setEditandoReunionId(reunion.id)

    setFormReunion({
      titulo: reunion.titulo || "",
      descripcion: reunion.descripcion || "",
      encargado: reunion.encargado || "",
      fechaReunion: fechaParaInput(reunion.fechaReunion),
    })

    setMensaje("Editando reunión")
    setMostrarReunion(true)
  }

  async function guardarCitacion(e) {
    e.preventDefault()

    const payload = {
      nombreApoderado: formCitacion.nombreApoderado.trim(),
      nombreEstudiante: formCitacion.nombreEstudiante.trim(),
      motivo: formCitacion.motivo.trim(),
      fechaCitacion: normalizarFecha(formCitacion.fechaCitacion),
    }

    try {
      setGuardando(true)
      setMensaje("")

      if (editandoCitacionId) {
        await actualizarCitacion(editandoCitacionId, payload)
        setMensaje("Citación editada correctamente")
      } else {
        await crearCitacion(payload)
        setMensaje("Citación creada correctamente")
      }

      limpiarCitacion()
      setMostrarCitacion(false)
      await cargarCitaciones()
    } catch (error) {
      setMensaje(`Error al guardar citación: ${obtenerMensajeError(error)}`)
    } finally {
      setGuardando(false)
    }
  }

  function editarCitacion(citacion) {
    setEditandoCitacionId(citacion.id)

    setFormCitacion({
      nombreApoderado: citacion.nombreApoderado || "",
      nombreEstudiante: citacion.nombreEstudiante || "",
      motivo: citacion.motivo || "",
      fechaCitacion: fechaParaInput(citacion.fechaCitacion),
    })

    setMensaje("Editando citación")
    setMostrarCitacion(true)
  }

  async function guardarBitacora(e) {
    e.preventDefault()

    const payload = {
      tema: formBitacora.tema.trim(),
      observacion: formBitacora.observacion.trim(),
      participantes: formBitacora.participantes.trim(),
    }

    try {
      setGuardando(true)
      setMensaje("")

      if (editandoBitacoraId) {
        await actualizarBitacoraGeneral(editandoBitacoraId, payload)
        setMensaje("Bitácora editada correctamente")
      } else {
        await crearBitacoraGeneral(payload)
        setMensaje("Bitácora creada correctamente")
      }

      limpiarBitacora()
      setMostrarBitacora(false)
      await cargarBitacoras()
    } catch (error) {
      setMensaje(`Error al guardar bitácora: ${obtenerMensajeError(error)}`)
    } finally {
      setGuardando(false)
    }
  }

  function editarBitacora(bitacora) {
    setEditandoBitacoraId(bitacora.id)

    setFormBitacora({
      tema: bitacora.tema || "",
      observacion: bitacora.observacion || "",
      participantes: bitacora.participantes || "",
    })

    setMensaje("Editando bitácora")
    setMostrarBitacora(true)
  }

  function solicitarEliminar(tipo, item) {
    setItemAEliminar({
      tipo,
      item,
      nombre:
        tipo === "reunión"
          ? item.titulo
          : tipo === "citación"
            ? item.nombreApoderado
            : item.tema,
    })
  }

  function cancelarEliminar() {
    setItemAEliminar(null)
  }

  async function confirmarEliminar() {
    if (!itemAEliminar) return

    try {
      setMensaje("")

      if (itemAEliminar.tipo === "reunión") {
        await eliminarReunion(itemAEliminar.item.id)
        setMensaje("Reunión eliminada correctamente")
        await cargarReuniones()
      }

      if (itemAEliminar.tipo === "citación") {
        await eliminarCitacion(itemAEliminar.item.id)
        setMensaje("Citación eliminada correctamente")
        await cargarCitaciones()
      }

      if (itemAEliminar.tipo === "bitácora") {
        await eliminarBitacoraGeneral(itemAEliminar.item.id)
        setMensaje("Bitácora eliminada correctamente")
        await cargarBitacoras()
      }

      setItemAEliminar(null)
    } catch (error) {
      setMensaje(`Error al eliminar ${itemAEliminar.tipo}: ${obtenerMensajeError(error)}`)
    }
  }

  const textoBusqueda = busqueda.toLowerCase()

  const reunionesFiltradas = reuniones.filter((item) =>
    [
      item.id,
      item.titulo,
      item.descripcion,
      item.encargado,
      item.fechaReunion,
      item.estado,
    ]
      .join(" ")
      .toLowerCase()
      .includes(textoBusqueda)
  )

  const citacionesFiltradas = citaciones.filter((item) =>
    [
      item.id,
      item.nombreApoderado,
      item.nombreEstudiante,
      item.motivo,
      item.fechaCitacion,
      item.estado,
    ]
      .join(" ")
      .toLowerCase()
      .includes(textoBusqueda)
  )

  const bitacorasFiltradas = bitacoras.filter((item) =>
    [
      item.id,
      item.tema,
      item.observacion,
      item.participantes,
      item.fechaRegistro,
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

          <h1>🏢 Gestión de Reuniones</h1>

          <p>
            Administra reuniones, citaciones de apoderados y bitácoras generales.
          </p>
        </div>

        <div className="header-buttons">

          <button
            className="new-user-btn"
            type="button"
            onClick={abrirNuevaReunion}
          >
            ➕ Nueva Reunión
          </button>

          <button
            className="new-user-btn"
            type="button"
            onClick={abrirNuevaCitacion}
          >
            ➕ Nueva Citación
          </button>

          <button
            className="new-user-btn"
            type="button"
            onClick={abrirNuevaBitacora}
          >
            ➕ Nueva Bitácora
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
              : mensaje.toLowerCase().includes("editando")
                ? "alert alert-info"
                : "alert alert-success"
          }
        >
          <span>
            {mensaje.toLowerCase().includes("error")
              ? "⚠️"
              : mensaje.toLowerCase().includes("editando")
                ? "✏️"
                : "✅"}
          </span>

          <p>{mensaje}</p>
        </div>
      )}

      <section className="users-summary-grid">

        <article className="users-summary-card">
          <span>🏢</span>
          <div>
            <h3>{reuniones.length}</h3>
            <p>Reuniones</p>
          </div>
        </article>

        <article className="users-summary-card">
          <span>👨‍👩‍👧</span>
          <div>
            <h3>{citaciones.length}</h3>
            <p>Citaciones</p>
          </div>
        </article>

        <article className="users-summary-card">
          <span>📒</span>
          <div>
            <h3>{bitacoras.length}</h3>
            <p>Bitácoras</p>
          </div>
        </article>

        <article className="users-summary-card">
          <span>🔎</span>
          <div>
            <h3>
              {reunionesFiltradas.length + citacionesFiltradas.length + bitacorasFiltradas.length}
            </h3>
            <p>Resultados</p>
          </div>
        </article>

      </section>

      <section className="admin-table-card">

        <div className="table-header">

          <div>
            <span className="page-tag">BUSCADOR</span>

            <h2>Buscar registros</h2>

            <p>
              Reuniones: <strong>{reunionesFiltradas.length}</strong> | Citaciones:{" "}
              <strong>{citacionesFiltradas.length}</strong> | Bitácoras:{" "}
              <strong>{bitacorasFiltradas.length}</strong>
            </p>
          </div>

          <div className="table-tools">

            <div className="search-container">

              <input
                className="search-input"
                type="text"
                placeholder="🔍 Buscar por título, encargado, estudiante, apoderado o tema..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />

            </div>

          </div>

        </div>

      </section>

      {mostrarReunion && (
        <div className="modal-overlay">

          <section className="admin-form-card modal-card small-modal-card">

            <button
              className="modal-close"
              type="button"
              onClick={cerrarReunion}
            >
              ✕
            </button>

            <div className="form-title-box">

              <span className="page-tag">
                {editandoReunionId ? "EDITANDO" : "NUEVA REUNIÓN"}
              </span>

              <h2>
                {editandoReunionId ? `Editar reunión #${editandoReunionId}` : "Crear nueva reunión"}
              </h2>

              <p>
                Completa los datos de la reunión institucional.
              </p>

            </div>

            <form className="user-form" onSubmit={guardarReunion}>

              <label className="form-field">
                <span>Título</span>
                <input
                  name="titulo"
                  placeholder="Título"
                  value={formReunion.titulo}
                  onChange={handleReunionChange}
                  required
                />
              </label>

              <label className="form-field">
                <span>Encargado</span>
                <input
                  name="encargado"
                  placeholder="Encargado"
                  value={formReunion.encargado}
                  onChange={handleReunionChange}
                  required
                />
              </label>

              <label className="form-field full-width">
                <span>Descripción</span>
                <textarea
                  name="descripcion"
                  placeholder="Descripción de la reunión"
                  value={formReunion.descripcion}
                  onChange={handleReunionChange}
                  required
                />
              </label>

              <label className="form-field full-width">
                <span>Fecha y hora</span>
                <input
                  name="fechaReunion"
                  type="datetime-local"
                  value={formReunion.fechaReunion}
                  onChange={handleReunionChange}
                  required
                />
              </label>

              <div className="form-actions full-width">

                <button
                  className="save-user-btn"
                  type="submit"
                  disabled={guardando}
                >
                  {guardando ? "Guardando..." : editandoReunionId ? "Guardar reunión" : "Crear reunión"}
                </button>

                <button
                  className="cancel-user-btn"
                  type="button"
                  onClick={cerrarReunion}
                >
                  Cancelar
                </button>

              </div>

            </form>

          </section>

        </div>
      )}

      {mostrarCitacion && (
        <div className="modal-overlay">

          <section className="admin-form-card modal-card small-modal-card">

            <button
              className="modal-close"
              type="button"
              onClick={cerrarCitacion}
            >
              ✕
            </button>

            <div className="form-title-box">

              <span className="page-tag">
                {editandoCitacionId ? "EDITANDO" : "NUEVA CITACIÓN"}
              </span>

              <h2>
                {editandoCitacionId ? `Editar citación #${editandoCitacionId}` : "Crear nueva citación"}
              </h2>

              <p>
                Registra citaciones de apoderados y estudiantes.
              </p>

            </div>

            <form className="user-form" onSubmit={guardarCitacion}>

              <label className="form-field">
                <span>Nombre apoderado</span>
                <input
                  name="nombreApoderado"
                  placeholder="Nombre apoderado"
                  value={formCitacion.nombreApoderado}
                  onChange={handleCitacionChange}
                  required
                />
              </label>

              <label className="form-field">
                <span>Nombre estudiante</span>
                <input
                  name="nombreEstudiante"
                  placeholder="Nombre estudiante"
                  value={formCitacion.nombreEstudiante}
                  onChange={handleCitacionChange}
                  required
                />
              </label>

              <label className="form-field full-width">
                <span>Motivo</span>
                <textarea
                  name="motivo"
                  placeholder="Motivo de la citación"
                  value={formCitacion.motivo}
                  onChange={handleCitacionChange}
                  required
                />
              </label>

              <label className="form-field full-width">
                <span>Fecha y hora</span>
                <input
                  name="fechaCitacion"
                  type="datetime-local"
                  value={formCitacion.fechaCitacion}
                  onChange={handleCitacionChange}
                  required
                />
              </label>

              <div className="form-actions full-width">

                <button
                  className="save-user-btn"
                  type="submit"
                  disabled={guardando}
                >
                  {guardando ? "Guardando..." : editandoCitacionId ? "Guardar citación" : "Crear citación"}
                </button>

                <button
                  className="cancel-user-btn"
                  type="button"
                  onClick={cerrarCitacion}
                >
                  Cancelar
                </button>

              </div>

            </form>

          </section>

        </div>
      )}

      {mostrarBitacora && (
        <div className="modal-overlay">

          <section className="admin-form-card modal-card small-modal-card">

            <button
              className="modal-close"
              type="button"
              onClick={cerrarBitacora}
            >
              ✕
            </button>

            <div className="form-title-box">

              <span className="page-tag">
                {editandoBitacoraId ? "EDITANDO" : "NUEVA BITÁCORA"}
              </span>

              <h2>
                {editandoBitacoraId ? `Editar bitácora #${editandoBitacoraId}` : "Crear nueva bitácora"}
              </h2>

              <p>
                Registra observaciones generales y participantes.
              </p>

            </div>

            <form className="user-form" onSubmit={guardarBitacora}>

              <label className="form-field">
                <span>Tema</span>
                <input
                  name="tema"
                  placeholder="Tema"
                  value={formBitacora.tema}
                  onChange={handleBitacoraChange}
                  required
                />
              </label>

              <label className="form-field">
                <span>Participantes</span>
                <input
                  name="participantes"
                  placeholder="Participantes"
                  value={formBitacora.participantes}
                  onChange={handleBitacoraChange}
                  required
                />
              </label>

              <label className="form-field full-width">
                <span>Observación</span>
                <textarea
                  name="observacion"
                  placeholder="Observación general"
                  value={formBitacora.observacion}
                  onChange={handleBitacoraChange}
                  required
                />
              </label>

              <div className="form-actions full-width">

                <button
                  className="save-user-btn"
                  type="submit"
                  disabled={guardando}
                >
                  {guardando ? "Guardando..." : editandoBitacoraId ? "Guardar bitácora" : "Crear bitácora"}
                </button>

                <button
                  className="cancel-user-btn"
                  type="button"
                  onClick={cerrarBitacora}
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
            <span className="page-tag">REUNIONES</span>
            <h2>Reuniones registradas</h2>
            <p>Total: <strong>{reunionesFiltradas.length}</strong></p>
          </div>
        </div>

        {cargando ? (
          <div className="loading-box">
            Cargando...
          </div>
        ) : (
          <div className="table-responsive">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Reunión</th>
                  <th>Descripción</th>
                  <th>Encargado</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {reunionesFiltradas.map((item) => (
                  <tr key={item.id}>

                    <td>
                      <span className="id-badge">
                        #{item.id}
                      </span>
                    </td>

                    <td>
                      <div className="meeting-title-cell">
                        <div className="meeting-avatar">
                          🏢
                        </div>

                        <strong>{item.titulo}</strong>
                      </div>
                    </td>

                    <td>
                      <span className="description-cell">
                        {item.descripcion}
                      </span>
                    </td>

                    <td>{item.encargado}</td>

                    <td>
                      <span className="meeting-date-badge">
                        {fechaVisible(item.fechaReunion)}
                      </span>
                    </td>

                    <td>
                      <span className="meeting-status-badge">
                        {item.estado || "Sin estado"}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">

                        <button
                          className="edit-btn"
                          type="button"
                          onClick={() => editarReunion(item)}
                        >
                          Editar
                        </button>

                        <button
                          className="delete-btn"
                          type="button"
                          onClick={() => solicitarEliminar("reunión", item)}
                        >
                          Eliminar
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}

                {reunionesFiltradas.length === 0 && (
                  <tr>
                    <td colSpan="7" className="empty-table">
                      No hay reuniones disponibles
                    </td>
                  </tr>
                )}
              </tbody>

            </table>

          </div>
        )}

      </section>

      <section className="admin-table-card">

        <div className="table-header">
          <div>
            <span className="page-tag">CITACIONES</span>
            <h2>Citaciones registradas</h2>
            <p>Total: <strong>{citacionesFiltradas.length}</strong></p>
          </div>
        </div>

        <div className="table-responsive">

          <table className="admin-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Apoderado</th>
                <th>Estudiante</th>
                <th>Motivo</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {citacionesFiltradas.map((item) => (
                <tr key={item.id}>

                  <td>
                    <span className="id-badge">
                      #{item.id}
                    </span>
                  </td>

                  <td>
                    <div className="meeting-title-cell">
                      <div className="citation-avatar">
                        A
                      </div>

                      <strong>{item.nombreApoderado}</strong>
                    </div>
                  </td>

                  <td>{item.nombreEstudiante}</td>

                  <td>
                    <span className="description-cell">
                      {item.motivo}
                    </span>
                  </td>

                  <td>
                    <span className="meeting-date-badge">
                      {fechaVisible(item.fechaCitacion)}
                    </span>
                  </td>

                  <td>
                    <span className="meeting-status-badge">
                      {item.estado || "Sin estado"}
                    </span>
                  </td>

                  <td>
                    <div className="action-buttons">

                      <button
                        className="edit-btn"
                        type="button"
                        onClick={() => editarCitacion(item)}
                      >
                        Editar
                      </button>

                      <button
                        className="delete-btn"
                        type="button"
                        onClick={() => solicitarEliminar("citación", item)}
                      >
                        Eliminar
                      </button>

                    </div>
                  </td>

                </tr>
              ))}

              {citacionesFiltradas.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty-table">
                    No hay citaciones disponibles
                  </td>
                </tr>
              )}
            </tbody>

          </table>

        </div>

      </section>

      <section className="admin-table-card">

        <div className="table-header">
          <div>
            <span className="page-tag">BITÁCORA</span>
            <h2>Bitácora general</h2>
            <p>Total: <strong>{bitacorasFiltradas.length}</strong></p>
          </div>
        </div>

        <div className="table-responsive">

          <table className="admin-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Tema</th>
                <th>Observación</th>
                <th>Participantes</th>
                <th>Fecha registro</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {bitacorasFiltradas.map((item) => (
                <tr key={item.id}>

                  <td>
                    <span className="id-badge">
                      #{item.id}
                    </span>
                  </td>

                  <td>
                    <div className="meeting-title-cell">
                      <div className="log-avatar">
                        📒
                      </div>

                      <strong>{item.tema}</strong>
                    </div>
                  </td>

                  <td>
                    <span className="description-cell">
                      {item.observacion}
                    </span>
                  </td>

                  <td>{item.participantes}</td>

                  <td>
                    <span className="meeting-date-badge">
                      {fechaVisible(item.fechaRegistro)}
                    </span>
                  </td>

                  <td>
                    <div className="action-buttons">

                      <button
                        className="edit-btn"
                        type="button"
                        onClick={() => editarBitacora(item)}
                      >
                        Editar
                      </button>

                      <button
                        className="delete-btn"
                        type="button"
                        onClick={() => solicitarEliminar("bitácora", item)}
                      >
                        Eliminar
                      </button>

                    </div>
                  </td>

                </tr>
              ))}

              {bitacorasFiltradas.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty-table">
                    No hay bitácoras disponibles
                  </td>
                </tr>
              )}
            </tbody>

          </table>

        </div>

      </section>

      {itemAEliminar && (
        <div className="modal-overlay">

          <section className="confirm-modal">

            <div className="confirm-icon">
              ⚠️
            </div>

            <h2>
              Eliminar {itemAEliminar.tipo}
            </h2>

            <p>
              ¿Seguro que deseas eliminar{" "}
              <strong>
                {itemAEliminar.nombre}
              </strong>
              ?
            </p>

            <div className="confirm-actions">

              <button
                className="cancel-delete-btn"
                type="button"
                onClick={cancelarEliminar}
              >
                Cancelar
              </button>

              <button
                className="confirm-delete-btn"
                type="button"
                onClick={confirmarEliminar}
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

export default GestionReuniones