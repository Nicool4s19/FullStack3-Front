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
      await cargarAsignaturas()
    } catch (error) {
      setMensaje(`Error al crear asignatura: ${obtenerMensajeError(error)}`)
    } finally {
      setGuardando(false)
    }
  }

  async function borrarAsignatura(asignatura) {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar la asignatura ${asignatura.nombre}?`
    )

    if (!confirmar) return

    try {
      setMensaje("")

      await eliminarAsignatura(asignatura.idAsignatura)

      setMensaje("Asignatura eliminada correctamente")
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
          <h1>Gestión de Asignaturas</h1>
          <p>Crear, buscar y eliminar asignaturas.</p>
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
        <h2>Crear asignatura</h2>

        <form className="user-form" onSubmit={guardarAsignatura}>
          <input
            name="nombre"
            placeholder="Nombre de la asignatura"
            value={form.nombre}
            onChange={handleChange}
            required
          />

          <input
            name="codigo"
            placeholder="Código"
            value={form.codigo}
            onChange={handleChange}
            required
          />

          <input
            name="descripcion"
            placeholder="Descripción"
            value={form.descripcion}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={guardando}>
            {guardando ? "Guardando..." : "Crear asignatura"}
          </button>
        </form>
      </section>

      <section className="admin-table-card">
        <div className="table-header">
          <div>
            <h2>Asignaturas registradas</h2>
            <p>Total: {asignaturasFiltradas.length}</p>
          </div>

          <input
            placeholder="Buscar asignatura..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {cargando ? (
          <p>Cargando asignaturas...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Código</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {asignaturasFiltradas.map((asignatura) => (
                <tr key={asignatura.idAsignatura}>
                  <td>{asignatura.idAsignatura}</td>
                  <td>{asignatura.nombre}</td>
                  <td>{asignatura.codigo}</td>
                  <td>{asignatura.descripcion}</td>
                  <td>
                    <button onClick={() => borrarAsignatura(asignatura)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {asignaturasFiltradas.length === 0 && (
                <tr>
                  <td colSpan="5">
                    No hay asignaturas disponibles
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

export default GestionAsignaturas