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
  const [mensaje, setMensaje] = useState("")
  const [cargando, setCargando] = useState(false)
  const [guardando, setGuardando] = useState(false)

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
    } catch {
      setMensaje("Error al cargar usuarios")
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

  async function borrarUsuario(usuario) {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar a ${usuario.nombre || usuario.email}?`
    )

    if (!confirmar) return

    try {
      setMensaje("")
      await eliminarUsuario(usuario.idUsuario)
      setMensaje("Usuario eliminado correctamente")
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

    return texto.includes(busqueda.toLowerCase())
  })

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Gestión de Usuarios</h1>
          <p>Crear, editar, buscar y eliminar usuarios.</p>
        </div>

        <Link className="back-button" to="/">
          Volver
        </Link>
      </header>

      {mensaje && (
        <div className="alert">
          {mensaje}
        </div>
      )}

      <section className="admin-form-card">
        <h2>
          {editandoId ? `Editar usuario #${editandoId}` : "Crear usuario"}
        </h2>

        <form className="user-form" onSubmit={guardarUsuario}>
          <input
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />

          <input
            name="segundoNombre"
            placeholder="Segundo nombre"
            value={form.segundoNombre}
            onChange={handleChange}
          />

          <input
            name="apellido"
            placeholder="Apellido"
            value={form.apellido}
            onChange={handleChange}
            required
          />

          <input
            name="segundoApellido"
            placeholder="Segundo apellido"
            value={form.segundoApellido}
            onChange={handleChange}
          />

          <input
            name="rut"
            placeholder="RUT"
            value={form.rut}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Correo"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="telefono"
            placeholder="Teléfono"
            value={form.telefono}
            onChange={handleChange}
            required
          />

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

          <input
            name="idDireccion"
            type="number"
            placeholder="ID Dirección"
            value={form.idDireccion}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={guardando}>
            {guardando
              ? "Guardando..."
              : editandoId
                ? "Guardar cambios"
                : "Crear usuario"}
          </button>

          {editandoId && (
            <button type="button" onClick={limpiarFormulario}>
              Cancelar edición
            </button>
          )}
        </form>
      </section>

      <section className="admin-table-card">
        <div className="table-header">
          <div>
            <h2>Usuarios registrados</h2>
            <p>Total: {usuariosFiltrados.length}</p>
          </div>

          <input
            placeholder="Buscar usuario..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {cargando ? (
          <p>Cargando usuarios...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
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
                  <td>{usuario.idUsuario}</td>

                  <td>
                    {usuario.nombre} {usuario.apellido}
                  </td>

                  <td>{usuario.rut}</td>

                  <td>{usuario.email}</td>

                  <td>{usuario.telefono}</td>

                  <td>
                    {usuario.rol?.nombreRol || "Sin rol"}
                  </td>

                  <td>
                    {usuario.activo ? "Activo" : "Inactivo"}
                  </td>

                  <td>
                    <button onClick={() => editarUsuario(usuario)}>
                      Editar
                    </button>

                    <button onClick={() => borrarUsuario(usuario)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {usuariosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="8">
                    No hay usuarios disponibles
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

export default GestionUsuarios