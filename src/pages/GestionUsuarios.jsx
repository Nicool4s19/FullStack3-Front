import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  listarRoles,
} from "../services/usuarioService"
const usuarioInicial = {
  nombre: "",
  segundoNombre: "",
  apellido: "",
  segundoApellido: "",
  rut: "",
  email: "",
  telefono: "",
  password: "",
  idRol: 2,
  idDireccion: 1,
}

function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [roles, setRoles] = useState([])
  const [form, setForm] = useState(usuarioInicial)
  const [editandoId, setEditandoId] = useState(null)
  const [busqueda, setBusqueda] = useState("")
  const [filtroRol, setFiltroRol] = useState("TODOS")
  const [mensaje, setMensaje] = useState("")
  const [cargando, setCargando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null)
  
  

  useEffect(() => {
    cargarDatos()
  }, [])

  async function cargarDatos() {
    await Promise.all([
      cargarUsuarios(),
      cargarRoles(),
    ])
  }

  async function cargarUsuarios() {
  try {
    setCargando(true)

    const { data } = await listarUsuarios()

    setUsuarios(Array.isArray(data) ? data : [])
  } catch (error) {
    console.error("Error al cargar usuarios:", error)

    setMensaje(
      `Error al cargar usuarios: ${
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Error desconocido"
      }`
    )
  } finally {
    setCargando(false)
  }
}

  async function cargarRoles() {
    try {
      const { data } = await listarRoles()

      if (Array.isArray(data) && data.length > 0) {
        setRoles(data)
      } else {
        setRoles([
          { idRol: 1, nombreRol: "ADMIN" },
          { idRol: 2, nombreRol: "USER" },
        ])
      }
    } catch {
      setRoles([
        { idRol: 1, nombreRol: "ADMIN" },
        { idRol: 2, nombreRol: "USER" },
      ])
    }
  }

  function handleChange(e) {
    const { name, value } = e.target

    setForm({
      ...form,
      [name]:
        name === "idRol" || name === "idDireccion"
          ? Number(value)
          : value,
    })
  }

  function limpiarFormulario() {
    setForm(usuarioInicial)
    setEditandoId(null)
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

  async function guardarUsuario(e) {
    e.preventDefault()

    const payload = {
      nombre: form.nombre.trim(),
      segundoNombre: form.segundoNombre.trim() || null,
      apellido: form.apellido.trim(),
      segundoApellido: form.segundoApellido.trim() || null,
      rut: form.rut.trim(),
      email: form.email.trim(),
      telefono: form.telefono.trim(),
      password: form.password,
      idRol: Number(form.idRol),
      idDireccion: Number(form.idDireccion),
    }

    try {
      setGuardando(true)
      setMensaje("")

      if (editandoId) {
        await actualizarUsuario(editandoId, payload)
        setMensaje("Usuario editado correctamente")
      } else {
        await crearUsuario(payload)
        setMensaje("Usuario creado correctamente")
      }

      limpiarFormulario()
      setMostrarFormulario(false)
      await cargarUsuarios()
    } catch (error) {
      setMensaje(`Error al guardar usuario: ${obtenerMensajeError(error)}`)
    } finally {
      setGuardando(false)
    }
  }

  function editarUsuario(usuario) {
    setEditandoId(usuario.idUsuario)

    setForm({
      nombre: usuario.nombre || "",
      segundoNombre: usuario.segundoNombre || "",
      apellido: usuario.apellido || "",
      segundoApellido: usuario.segundoApellido || "",
      rut: usuario.rut || "",
      email: usuario.email || "",
      telefono: usuario.telefono || "",
      password: "",
      idRol: usuario.rol?.idRol || 2,
      idDireccion: usuario.direccion?.idDireccion || 1,
    })

    setMensaje("Modo edición activado. Ingresa la contraseña para guardar cambios.")
  }

  function solicitarEliminarUsuario(usuario) {
  setUsuarioAEliminar(usuario)
}

function cancelarEliminarUsuario() {
  setUsuarioAEliminar(null)
}

async function confirmarEliminarUsuario() {
  if (!usuarioAEliminar) return

  try {
    setMensaje("")

    await eliminarUsuario(usuarioAEliminar.idUsuario)

    setMensaje("Usuario eliminado correctamente")

    setUsuarioAEliminar(null)

    await cargarUsuarios()
  } catch (error) {
    setMensaje(`Error al eliminar usuario: ${obtenerMensajeError(error)}`)
   }
  }

  const usuariosFiltrados = usuarios.filter((usuario) => {
  const texto = [
    usuario.idUsuario,
    usuario.nombre,
    usuario.segundoNombre,
    usuario.apellido,
    usuario.segundoApellido,
    usuario.rut,
    usuario.email,
    usuario.telefono,
    usuario.rol?.nombreRol,
  ]
    .join(" ")
    .toLowerCase()

  const coincideBusqueda = texto.includes(busqueda.toLowerCase())

  const rolUsuario = usuario.rol?.nombreRol || "Sin rol"

  const coincideRol =
    filtroRol === "TODOS" || rolUsuario === filtroRol

  return coincideBusqueda && coincideRol
})
  const abrirNuevoUsuario = () => {
  limpiarFormulario()
  setMostrarFormulario(true)
}

const cerrarFormulario = () => {
  limpiarFormulario()
  setMostrarFormulario(false)
}

const abrirEditarUsuario = (usuario) => {
  editarUsuario(usuario)
  setMostrarFormulario(true)
}
  return (
    <main className="admin-page">
      <header className="admin-header">

    <div>

        <span className="page-tag">
            PANEL ADMINISTRATIVO
        </span>
        <h1>👥 Gestión de Usuarios</h1>
        <p>
          Administra estudiantes, profesores, apoderados y administradores del sistema.
        </p>
    </div>
    <div className="header-buttons">
        <button
  className="new-user-btn"
  onClick={abrirNuevoUsuario}>
  ➕ Nuevo Usuario
  </button>
        <Link
            className="back-button"
            to="/"
        >
            ⬅ Dashboard
        </Link>

    </div>

</header>

      {mensaje && (
  <div
    className={
      mensaje.toLowerCase().includes("error")
        ? "alert alert-error"
        : mensaje.toLowerCase().includes("modo edición")
          ? "alert alert-info"
          : "alert alert-success"
    }
  >
    <span>
      {mensaje.toLowerCase().includes("error")
        ? "⚠️"
        : mensaje.toLowerCase().includes("modo edición")
          ? "✏️"
          : "✅"}
    </span>

    <p>{mensaje}</p>
  </div>
)}
      <section className="users-summary-grid">

  <article className="users-summary-card">
    <span>👥</span>
    <div>
      <h3>{usuarios.length}</h3>
      <p>Total usuarios</p>
    </div>
  </article>

  <article className="users-summary-card">
    <span>👑</span>
    <div>
      <h3>
        {
          usuarios.filter(
            (u) => u.rol?.nombreRol?.toLowerCase().includes("admin")
          ).length
        }
      </h3>
      <p>Administradores</p>
    </div>
  </article>

  <article className="users-summary-card">
    <span>🎓</span>
    <div>
      <h3>
        {
          usuarios.filter(
            (u) => u.rol?.nombreRol?.toLowerCase().includes("user")
          ).length
        }
      </h3>
      <p>Usuarios comunes</p>
    </div>
  </article>

  <article className="users-summary-card">
    <span>✅</span>
    <div>
      <h3>
        {
          usuarios.filter((u) => u.activo).length
        }
      </h3>
      <p>Activos</p>
    </div>
  </article>

</section>

    {mostrarFormulario && (
  <div className="modal-overlay">

    <section className="admin-form-card modal-card">

      <button
        className="modal-close"
        type="button"
        onClick={cerrarFormulario}
      >
        ✕
      </button>

      <div className="form-title-box">

        <span className="page-tag">
          {editandoId ? "EDITANDO" : "NUEVO REGISTRO"}
        </span>

        <h2>
          {editandoId ? `Editar usuario #${editandoId}` : "Crear nuevo usuario"}
        </h2>

        <p>
          Completa los datos personales y de acceso del usuario.
        </p>

      </div>

      <form className="user-form" onSubmit={guardarUsuario}>

        <label className="form-field">
          <span>Nombre</span>
          <input
            name="nombre"
            placeholder="Ej: Benja"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </label>

        <label className="form-field">
          <span>Segundo nombre</span>
          <input
            name="segundoNombre"
            placeholder="Opcional"
            value={form.segundoNombre}
            onChange={handleChange}
          />
        </label>

        <label className="form-field">
          <span>Apellido</span>
          <input
            name="apellido"
            placeholder="Ej: Usuario"
            value={form.apellido}
            onChange={handleChange}
            required
          />
        </label>

        <label className="form-field">
          <span>Segundo apellido</span>
          <input
            name="segundoApellido"
            placeholder="Opcional"
            value={form.segundoApellido}
            onChange={handleChange}
          />
        </label>

        <label className="form-field">
          <span>RUT</span>
          <input
            name="rut"
            placeholder="Ej: 12.345.678-9"
            value={form.rut}
            onChange={handleChange}
            required
          />
        </label>

        <label className="form-field">
          <span>Correo electrónico</span>
          <input
            name="email"
            type="email"
            placeholder="usuario@correo.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className="form-field">
          <span>Teléfono</span>
          <input
            name="telefono"
            placeholder="Ej: 999999999"
            value={form.telefono}
            onChange={handleChange}
            required
          />
        </label>

        <label className="form-field">
          <span>Contraseña</span>
          <input
            name="password"
            type="text"
            placeholder={
              editandoId
                ? "Contraseña requerida para editar"
                : "Contraseña"
            }
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        <label className="form-field">
          <span>Rol del usuario</span>
          <select
            name="idRol"
            value={form.idRol}
            onChange={handleChange}
            required
          >
            {roles.map((rol) => (
              <option key={rol.idRol} value={rol.idRol}>
                {rol.nombreRol}
              </option>
            ))}
          </select>
        </label>

        <label className="form-field">
          <span>ID Dirección</span>
          <input
            name="idDireccion"
            type="number"
            placeholder="Ej: 1"
            value={form.idDireccion}
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
            {guardando
              ? "Guardando..."
              : editandoId
                ? "Guardar cambios"
                : "Crear usuario"}
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
      <span className="page-tag">LISTADO</span>

      <h2>Usuarios registrados</h2>

      <p>
        Total encontrados: <strong>{usuariosFiltrados.length}</strong>
      </p>
    </div>

    <div className="table-tools">

  <div className="search-container">

    <input
      className="search-input"
      type="text"
      placeholder="🔍 Buscar por nombre, correo o RUT..."
      value={busqueda}
      onChange={(e) => setBusqueda(e.target.value)}
    />

  </div>

  <select
    className="role-filter"
    value={filtroRol}
    onChange={(e) => setFiltroRol(e.target.value)}
  >
    <option value="TODOS">Todos los roles</option>

    {roles.map((rol) => (
      <option key={rol.idRol} value={rol.nombreRol}>
        {rol.nombreRol}
      </option>
    ))}
  </select>

</div>

  </div>

  {cargando ? (
    <div className="loading-box">
      Cargando usuarios...
    </div>
  ) : (
    <div className="table-responsive">

      <table className="admin-table">

        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>RUT</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {usuariosFiltrados.map((usuario) => (
            <tr key={usuario.idUsuario}>

              <td>
                <span className="id-badge">
                  #{usuario.idUsuario}
                </span>
              </td>

              <td>
                <div className="user-table-info">

                  <div className="user-table-avatar">
                    {usuario.nombre?.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <strong>
                      {usuario.nombre} {usuario.apellido}
                    </strong>

                    <span>
                      {usuario.segundoNombre || ""} {usuario.segundoApellido || ""}
                    </span>
                  </div>

                </div>
              </td>

              <td>{usuario.rut}</td>

              <td>{usuario.email}</td>

              <td>{usuario.telefono}</td>

              <td>
                <span
                  className={`role-badge role-${(usuario.rol?.nombreRol || "sin-rol")
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  {usuario.rol?.nombreRol || "Sin rol"}
                </span>
              </td>

              <td>
                <span className={usuario.activo ? "status-active" : "status-inactive"}>
                  {usuario.activo ? "Activo" : "Inactivo"}
                </span>
              </td>

              <td>
                <div className="action-buttons">

                  <button
                    className="edit-btn"
                    onClick={() => abrirEditarUsuario(usuario)}
                  >
                    Editar
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => solicitarEliminarUsuario(usuario)}
                  >
                    Eliminar
                  </button>

                </div>
              </td>

            </tr>
          ))}

          {usuariosFiltrados.length === 0 && (
            <tr>
              <td colSpan="8" className="empty-table">
                No hay usuarios disponibles
              </td>
            </tr>
          )}
        </tbody>

      </table>

    </div>
  )}

</section>

{usuarioAEliminar && (
  <div className="modal-overlay">

    <section className="confirm-modal">

      <div className="confirm-icon">
        ⚠️
      </div>

      <h2>Eliminar usuario</h2>

      <p>
        ¿Seguro que deseas eliminar a{" "}
        <strong>
          {usuarioAEliminar.nombre || usuarioAEliminar.email}
        </strong>
        ?
      </p>

      <div className="confirm-actions">

        <button
          className="cancel-delete-btn"
          type="button"
          onClick={cancelarEliminarUsuario}
        >
          Cancelar
        </button>

        <button
          className="confirm-delete-btn"
          type="button"
          onClick={confirmarEliminarUsuario}
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

export default GestionUsuarios