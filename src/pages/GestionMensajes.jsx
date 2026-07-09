import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import {
  listarMensajes,
  crearMensaje,
  eliminarMensaje,
  marcarMensajeComoLeido,
} from "../services/mensajeService"

import { listarUsuarios } from "../services/usuarioService"

import {
  canManageMessages,
  canDeleteMessages,
} from "../auth/roles"

const mensajeInicial = {
  idRemitente: "",
  idDestinatario: "",
  asunto: "",
  contenidoMensaje: "",
}

function GestionMensajes({ user }) {
  const puedeGestionarMensajes = canManageMessages(user?.role)
  const puedeEliminarMensajes = canDeleteMessages(user?.role)

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
    if (!puedeGestionarMensajes) {
      setMensajeSistema("Tu rol no puede crear mensajes")
      return
    }

    limpiarFormulario()
    setMostrarFormulario(true)
  }

  function cerrarFormulario() {
    limpiarFormulario()
    setMostrarFormulario(false)
  }

  async function guardarMensaje(e) {
    e.preventDefault()

    if (!puedeGestionarMensajes) {
      setMensajeSistema("Tu rol no puede crear mensajes")
      return
    }

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

  async function marcarLeido(idMensaje) {
    try {
      await marcarMensajeComoLeido(idMensaje)
      await cargarMensajes()
    } catch (error) {
      setMensajeSistema(`Error al marcar mensaje: ${obtenerMensajeError(error)}`)
    }
  }

  function solicitarEliminarMensaje(mensaje) {
    if (!puedeEliminarMensajes) {
      setMensajeSistema("Tu rol no puede eliminar mensajes")
      return
    }

    setMensajeAEliminar(mensaje)
  }

  function cancelarEliminarMensaje() {
    setMensajeAEliminar(null)
  }

  async function confirmarEliminarMensaje() {
    if (!mensajeAEliminar || !puedeEliminarMensajes) return

    try {
      setMensajeSistema("")

      await eliminarMensaje(mensajeAEliminar.idMensaje)

      setMensajeSistema("Mensaje eliminado correctamente")
      setMensajeAEliminar(null)
      await cargarMensajes()
    } catch (error) {
      setMensajeSistema(`Error al eliminar mensaje: ${obtenerMensajeError(error)}`)
    }
  }

  function obtenerNombreUsuario(idUsuario) {
    const usuario = usuarios.find((item) => item.idUsuario === idUsuario)

    return usuario?.nombre || usuario?.email || `Usuario ${idUsuario}`
  }

  const mensajesFiltrados = mensajes.filter((mensaje) => {
    const texto = [
      mensaje.idMensaje,
      mensaje.asunto,
      mensaje.contenidoMensaje,
      mensaje.fechaEnvio,
      obtenerNombreUsuario(mensaje.idRemitente),
      obtenerNombreUsuario(mensaje.idDestinatario),
    ]
      .join(" ")
      .toLowerCase()

    return texto.includes(busqueda.toLowerCase())
  })

  const columnasTabla = puedeEliminarMensajes ? "7" : "6"

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <span className="page-tag">MENSAJERÍA</span>

          <h1>💬 Gestión de Mensajes</h1>

          <p>
            Revisa los mensajes internos del sistema.
          </p>

          {!puedeGestionarMensajes && (
            <p className="readonly-message">
              Vista de solo lectura para tu rol.
            </p>
          )}
        </div>

        <div className="header-buttons">
          {puedeGestionarMensajes && (
            <button
              className="new-user-btn"
              type="button"
              onClick={abrirFormulario}
            >
              ➕ Nuevo Mensaje
            </button>
          )}

          <Link className="back-button" to="/">
            ⬅ Dashboard
          </Link>
        </div>
      </header>

      {mensajeSistema && (
        <div
          className={
            mensajeSistema.toLowerCase().includes("error") ||
            mensajeSistema.toLowerCase().includes("no puede")
              ? "alert alert-error"
              : "alert alert-success"
          }
        >
          <span>
            {mensajeSistema.toLowerCase().includes("error") ||
            mensajeSistema.toLowerCase().includes("no puede")
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
          <span>📨</span>
          <div>
            <h3>{mensajes.filter((m) => !m.leido).length}</h3>
            <p>No leídos</p>
          </div>
        </article>

        <article className="users-summary-card">
          <span>👥</span>
          <div>
            <h3>{usuarios.length}</h3>
            <p>Usuarios</p>
          </div>
        </article>

        <article className="users-summary-card">
          <span>🔎</span>
          <div>
            <h3>{mensajesFiltrados.length}</h3>
            <p>Resultados</p>
          </div>
        </article>
      </section>

      {mostrarFormulario && puedeGestionarMensajes && (
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
              <span className="page-tag">NUEVO MENSAJE</span>

              <h2>Crear mensaje</h2>

              <p>
                Selecciona remitente, destinatario y escribe el contenido.
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
                    <option
                      key={usuario.idUsuario}
                      value={usuario.idUsuario}
                    >
                      {usuario.nombre || usuario.email}
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
                    <option
                      key={usuario.idUsuario}
                      value={usuario.idUsuario}
                    >
                      {usuario.nombre || usuario.email}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-field full-width">
                <span>Asunto</span>

                <input
                  name="asunto"
                  placeholder="Asunto del mensaje"
                  value={form.asunto}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="form-field full-width">
                <span>Contenido</span>

                <textarea
                  name="contenidoMensaje"
                  placeholder="Escribe el mensaje..."
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
                  {guardando ? "Enviando..." : "Enviar mensaje"}
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
                placeholder="🔍 Buscar por asunto, usuario o contenido..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>
        </div>

        {cargando ? (
          <div className="loading-box">Cargando mensajes...</div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Asunto</th>
                  <th>Remitente</th>
                  <th>Destinatario</th>
                  <th>Estado</th>
                  <th>Fecha</th>

                  {puedeEliminarMensajes && <th>Acciones</th>}
                </tr>
              </thead>

              <tbody>
                {mensajesFiltrados.map((mensaje) => (
                  <tr key={mensaje.idMensaje}>
                    <td>
                      <span className="id-badge">
                        #{mensaje.idMensaje}
                      </span>
                    </td>

                    <td>
                      <strong>{mensaje.asunto}</strong>
                      <p className="description-cell">
                        {mensaje.contenidoMensaje}
                      </p>
                    </td>

                    <td>{obtenerNombreUsuario(mensaje.idRemitente)}</td>

                    <td>{obtenerNombreUsuario(mensaje.idDestinatario)}</td>

                    <td>
                      <span className="subject-code-badge">
                        {mensaje.leido ? "Leído" : "No leído"}
                      </span>
                    </td>

                    <td>{mensaje.fechaEnvio || "Sin fecha"}</td>

                    {puedeEliminarMensajes && (
                      <td>
                        <div className="action-buttons">
                          {!mensaje.leido && (
                            <button
                              className="edit-btn"
                              type="button"
                              onClick={() => marcarLeido(mensaje.idMensaje)}
                            >
                              Marcar leído
                            </button>
                          )}

                          <button
                            className="delete-btn"
                            type="button"
                            onClick={() => solicitarEliminarMensaje(mensaje)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}

                {mensajesFiltrados.length === 0 && (
                  <tr>
                    <td colSpan={columnasTabla} className="empty-table">
                      No hay mensajes disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {mensajeAEliminar && puedeEliminarMensajes && (
        <div className="modal-overlay">
          <section className="confirm-modal">
            <div className="confirm-icon">⚠️</div>

            <h2>Eliminar mensaje</h2>

            <p>
              ¿Seguro que deseas eliminar{" "}
              <strong>{mensajeAEliminar.asunto}</strong>?
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