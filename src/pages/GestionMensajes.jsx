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

  async function borrarMensaje(mensaje) {
    const id = obtenerIdMensaje(mensaje)

    if (!id) {
      setMensajeSistema("No se encontró el ID del mensaje")
      return
    }

    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar el mensaje "${mensaje.asunto}"?`
    )

    if (!confirmar) return

    try {
      setMensajeSistema("")
      await eliminarMensaje(id)
      setMensajeSistema("Mensaje eliminado correctamente")
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

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Gestión de Mensajería</h1>
          <p>Crear, revisar, marcar como leído y eliminar mensajes.</p>
        </div>

        <Link className="back-button" to="/">
          Volver
        </Link>
      </header>

      {mensajeSistema && (
        <div className="alert">
          {mensajeSistema}
        </div>
      )}

      <section className="admin-form-card">
        <h2>Crear mensaje</h2>

        <form className="user-form" onSubmit={guardarMensaje}>
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

          <input
            name="asunto"
            placeholder="Asunto"
            value={form.asunto}
            onChange={handleChange}
            required
          />

          <input
            name="contenidoMensaje"
            placeholder="Contenido del mensaje"
            value={form.contenidoMensaje}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={guardando}>
            {guardando ? "Enviando..." : "Crear mensaje"}
          </button>
        </form>
      </section>

      <section className="admin-table-card">
        <div className="table-header">
          <div>
            <h2>Mensajes registrados</h2>
            <p>Total: {mensajesFiltrados.length}</p>
          </div>

          <input
            placeholder="Buscar mensaje..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {cargando ? (
          <p>Cargando mensajes...</p>
        ) : (
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
                  <td>{obtenerIdMensaje(mensaje)}</td>

                  <td>
                    {obtenerNombreUsuario(obtenerIdRemitente(mensaje))}
                  </td>

                  <td>
                    {obtenerNombreUsuario(obtenerIdDestinatario(mensaje))}
                  </td>

                  <td>{mensaje.asunto}</td>

                  <td>{mensaje.contenidoMensaje}</td>

                  <td>{estaLeido(mensaje)}</td>

                  <td>{obtenerFecha(mensaje)}</td>

                  <td>
                    <button onClick={() => marcarLeido(mensaje)}>
                      Marcar leído
                    </button>

                    <button onClick={() => borrarMensaje(mensaje)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {mensajesFiltrados.length === 0 && (
                <tr>
                  <td colSpan="8">
                    No hay mensajes disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </main>
  )
}

export default GestionMensajes