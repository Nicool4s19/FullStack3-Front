import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  listarMensajes,
  crearMensaje,
  eliminarMensaje,
  marcarMensajeComoLeido,
} from "../services/mensajeService"
import { listarUsuarios } from "../services/usuarioService"

const mensajeInicial = {
  idRemitente: "",
  idDestinatario: "",
  asunto: "",
  contenidoMensaje: "",
}

function GestionMensajes() {
  const [mensajes, setMensajes] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [form, setForm] = useState(mensajeInicial)
  const [busqueda, setBusqueda] = useState("")
  const [mensajeSistema, setMensajeSistema] = useState("")
  const [cargando, setCargando] = useState(false)
  const [guardando, setGuardando] = useState(false)

  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [mensajeAEliminar, setMensajeAEliminar] = useState(null)

  useEffect(() => {
    cargarDatos()
  }, [])

  async function cargarDatos() {
    await Promise.all([
      cargarMensajes(),
      cargarUsuarios(),
    ])
  }

  async function cargarMensajes() {
    try {
      setCargando(true)

      const { data } = await listarMensajes()

      setMensajes(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error al cargar mensajes:", error)
      setMensajeSistema("Error al cargar mensajes")
    } finally {
      setCargando(false)
    }
  }

  async function cargarUsuarios() {
    try {
      const { data } = await listarUsuarios()

      setUsuarios(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error al cargar usuarios:", error)
      setUsuarios([])
    }
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

  function handleChange(e) {
    const { name, value } = e.target

    setForm({
      ...form,
      [name]:
        name === "idRemitente" || name === "idDestinatario"
          ? Number(value)
          : value,
    })
  }

  function limpiarFormulario() {
    setForm(mensajeInicial)
  }

  function abrirFormulario() {
    limpiarFormulario()
    setMostrarFormulario(true)
  }

  function cerrarFormulario() {
    limpiarFormulario()
    setMostrarFormulario(false)
  }

  async function guardarMensaje(e) {
    e.preventDefault()

    const payload = {
      idRemitente: Number(form.idRemitente),
      idDestinatario: Number(form.idDestinatario),
      asunto: form.asunto.trim(),
      contenidoMensaje: form.contenidoMensaje.trim(),
    }

    try {
      setGuardando(true)
      setMensajeSistema("")

      await crearMensaje(payload)

      setMensajeSistema("Mensaje creado correctamente")
      limpiarFormulario()
      setMostrarFormulario(false)
      await cargarMensajes()
    } catch (error) {
      setMensajeSistema(`Error al crear mensaje: ${obtenerMensajeError(error)}`)
    } finally {
      setGuardando(false)
    }
  }

  async function marcarLeido(mensaje) {
    const id = obtenerIdMensaje(mensaje)

    if (!id) {
      setMensajeSistema("No se encontró el ID del mensaje")
      return
    }

    try {
      setMensajeSistema("")
      await marcarMensajeComoLeido(id)
      setMensajeSistema("Mensaje marcado como leído")
      await cargarMensajes()
    } catch (error) {
      setMensajeSistema(`Error al marcar como leído: ${obtenerMensajeError(error)}`)
    }
  }

  function solicitarEliminarMensaje(mensaje) {
    setMensajeAEliminar(mensaje)
  }

  function cancelarEliminarMensaje() {
    setMensajeAEliminar(null)
  }

  async function confirmarEliminarMensaje() {
    if (!mensajeAEliminar) return

    const id = obtenerIdMensaje(mensajeAEliminar)

    if (!id) {
      setMensajeSistema("No se encontró el ID del mensaje")
      return
    }

    try {
      setMensajeSistema("")

      await eliminarMensaje(id)

      setMensajeSistema("Mensaje eliminado correctamente")
      setMensajeAEliminar(null)
      await cargarMensajes()
    } catch (error) {
      setMensajeSistema(`Error al eliminar mensaje: ${obtenerMensajeError(error)}`)
    }
  }

  function obtenerIdMensaje(mensaje) {
    return mensaje.idMensaje || mensaje.id || mensaje.id_mensaje
  }

  function obtenerNombreUsuario(idUsuario) {
    const usuario = usuarios.find(
      (item) => Number(item.idUsuario) === Number(idUsuario)
    )

    if (!usuario) {
      return `Usuario #${idUsuario || "N/A"}`
    }

    return `${usuario.nombre || ""} ${usuario.apellido || ""}`.trim() || usuario.email
  }

  function obtenerIdRemitente(mensaje) {
    return (
      mensaje.idRemitente ||
      mensaje.remitente?.idUsuario ||
      mensaje.remitenteId ||
      mensaje.usuarioRemitente?.idUsuario
    )
  }

  function obtenerIdDestinatario(mensaje) {
    return (
      mensaje.idDestinatario ||
      mensaje.destinatario?.idUsuario ||
      mensaje.destinatarioId ||
      mensaje.usuarioDestinatario?.idUsuario
    )
  }

  function obtenerFecha(mensaje) {
    return (
      mensaje.fechaEnvio ||
      mensaje.fechaMensaje ||
      mensaje.fechaCreacion ||
      mensaje.createdAt ||
      "Sin fecha"
    )
  }

  function estaLeido(mensaje) {
    if (mensaje.leido === true) return "Leído"
    if (mensaje.leido === false) return "No leído"
    if (mensaje.estado) return mensaje.estado
    return "Sin estado"
  }

  const mensajesFiltrados = mensajes.filter((mensaje) => {
    const remitente = obtenerNombreUsuario(obtenerIdRemitente(mensaje))
    const destinatario = obtenerNombreUsuario(obtenerIdDestinatario(mensaje))

    const texto = [
      obtenerIdMensaje(mensaje),
      remitente,
      destinatario,
      mensaje.asunto,
      mensaje.contenidoMensaje,
      estaLeido(mensaje),
      obtenerFecha(mensaje),
    ]
      .join(" ")
      .toLowerCase()

    return texto.includes(busqueda.toLowerCase())
  })

  const mensajesLeidos = mensajes.filter((mensaje) => estaLeido(mensaje).toLowerCase() === "leído").length

  const mensajesNoLeidos = mensajes.filter((mensaje) => estaLeido(mensaje).toLowerCase() === "no leído").length

  return (
    <main className="admin-page">

      <header className="admin-header">

        <div>
          <span className="page-tag">
            PANEL ADMINISTRATIVO
          </span>

          <h1>💬 Gestión de Mensajería</h1>

          <p>
            Crea, revisa, marca como leído y elimina mensajes del sistema.
          </p>
        </div>

        <div className="header-buttons">

          <button
            className="new-user-btn"
            type="button"
            onClick={abrirFormulario}
          >
            ➕ Nuevo Mensaje
          </button>

          <Link className="back-button" to="/">
            ⬅ Dashboard
          </Link>

        </div>

      </header>

      {mensajeSistema && (
        <div
          className={
            mensajeSistema.toLowerCase().includes("error") ||
            mensajeSistema.toLowerCase().includes("no se encontró")
              ? "alert alert-error"
              : "alert alert-success"
          }
        >
          <span>
            {mensajeSistema.toLowerCase().includes("error") ||
            mensajeSistema.toLowerCase().includes("no se encontró")
              ? "⚠️"
              : "✅"}
          </span>

          <p>{mensajeSistema}</p>
        </div>
      )}

      <section className="users-summary-grid">

        <article className="users-summary-card">
          <span>💬</span>
          <div>
            <h3>{mensajes.length}</h3>
            <p>Total mensajes</p>
          </div>
        </article>

        <article className="users-summary-card">
          <span>📩</span>
          <div>
            <h3>{mensajesNoLeidos}</h3>
            <p>No leídos</p>
          </div>
        </article>

        <article className="users-summary-card">
          <span>✅</span>
          <div>
            <h3>{mensajesLeidos}</h3>
            <p>Leídos</p>
          </div>
        </article>

        <article className="users-summary-card">
          <span>👥</span>
          <div>
            <h3>{usuarios.length}</h3>
            <p>Usuarios</p>
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
                NUEVO MENSAJE
              </span>

              <h2>Crear nuevo mensaje</h2>

              <p>
                Selecciona remitente, destinatario y escribe el contenido del mensaje.
              </p>

            </div>

            <form className="user-form" onSubmit={guardarMensaje}>

              <label className="form-field">
                <span>Remitente</span>

                <select
                  name="idRemitente"
                  value={form.idRemitente}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona remitente</option>

                  {usuarios.map((usuario) => (
                    <option key={usuario.idUsuario} value={usuario.idUsuario}>
                      {usuario.nombre} {usuario.apellido} - {usuario.email}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field">
                <span>Destinatario</span>

                <select
                  name="idDestinatario"
                  value={form.idDestinatario}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona destinatario</option>

                  {usuarios.map((usuario) => (
                    <option key={usuario.idUsuario} value={usuario.idUsuario}>
                      {usuario.nombre} {usuario.apellido} - {usuario.email}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field full-width">
                <span>Asunto</span>

                <input
                  name="asunto"
                  placeholder="Ej: Reunión de apoderados"
                  value={form.asunto}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="form-field full-width">
                <span>Contenido del mensaje</span>

                <textarea
                  name="contenidoMensaje"
                  placeholder="Escribe el contenido del mensaje..."
                  value={form.contenidoMensaje}
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
                  {guardando ? "Enviando..." : "Crear mensaje"}
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
            <span className="page-tag">MENSAJES</span>

            <h2>Mensajes registrados</h2>

            <p>
              Total encontrados: <strong>{mensajesFiltrados.length}</strong>
            </p>
          </div>

          <div className="table-tools">

            <div className="search-container">

              <input
                className="search-input"
                type="text"
                placeholder="🔍 Buscar por usuario, asunto, estado o fecha..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />

            </div>

          </div>

        </div>

        {cargando ? (
          <div className="loading-box">
            Cargando mensajes...
          </div>
        ) : (
          <div className="table-responsive">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Remitente</th>
                  <th>Destinatario</th>
                  <th>Asunto</th>
                  <th>Contenido</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {mensajesFiltrados.map((mensaje) => (
                  <tr key={obtenerIdMensaje(mensaje)}>

                    <td>
                      <span className="id-badge">
                        #{obtenerIdMensaje(mensaje)}
                      </span>
                    </td>

                    <td>
                      <div className="message-user-cell">
                        <div className="message-avatar">
                          R
                        </div>

                        <strong>
                          {obtenerNombreUsuario(obtenerIdRemitente(mensaje))}
                        </strong>
                      </div>
                    </td>

                    <td>
                      <div className="message-user-cell">
                        <div className="message-avatar message-avatar-dest">
                          D
                        </div>

                        <strong>
                          {obtenerNombreUsuario(obtenerIdDestinatario(mensaje))}
                        </strong>
                      </div>
                    </td>

                    <td>
                      <strong className="message-subject">
                        {mensaje.asunto}
                      </strong>
                    </td>

                    <td>
                      <span className="message-content-cell">
                        {mensaje.contenidoMensaje}
                      </span>
                    </td>

                    <td>
                      <span
                        className={
                          estaLeido(mensaje).toLowerCase() === "leído"
                            ? "message-status-read"
                            : "message-status-unread"
                        }
                      >
                        {estaLeido(mensaje)}
                      </span>
                    </td>

                    <td>
                      <span className="message-date-badge">
                        {obtenerFecha(mensaje)}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">

                        <button
                          className="edit-btn"
                          type="button"
                          onClick={() => marcarLeido(mensaje)}
                        >
                          Marcar leído
                        </button>

                        <button
                          className="delete-btn"
                          type="button"
                          onClick={() => solicitarEliminarMensaje(mensaje)}
                        >
                          Eliminar
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}

                {mensajesFiltrados.length === 0 && (
                  <tr>
                    <td colSpan="8" className="empty-table">
                      No hay mensajes disponibles
                    </td>
                  </tr>
                )}
              </tbody>

            </table>

          </div>
        )}

      </section>

      {mensajeAEliminar && (
        <div className="modal-overlay">

          <section className="confirm-modal">

            <div className="confirm-icon">
              ⚠️
            </div>

            <h2>Eliminar mensaje</h2>

            <p>
              ¿Seguro que deseas eliminar{" "}
              <strong>
                {mensajeAEliminar.asunto}
              </strong>
              ?
            </p>

            <div className="confirm-actions">

              <button
                className="cancel-delete-btn"
                type="button"
                onClick={cancelarEliminarMensaje}
              >
                Cancelar
              </button>

              <button
                className="confirm-delete-btn"
                type="button"
                onClick={confirmarEliminarMensaje}
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

export default GestionMensajes