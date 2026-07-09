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
      await cargarAnotaciones()
    } catch (error) {
      setMensaje(`Error al crear anotación: ${obtenerMensajeError(error)}`)
    } finally {
      setGuardando(false)
    }
  }

  async function borrarAnotacion(anotacion) {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar esta anotación?`
    )

    if (!confirmar) return

    try {
      setMensaje("")

      await eliminarAnotacion(anotacion.idAnotacion)

      setMensaje("Anotación eliminada correctamente")
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
          <h1>Gestión de Anotaciones</h1>
          <p>Crear, buscar y eliminar anotaciones.</p>
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
        <h2>Crear anotación</h2>

        <form className="user-form" onSubmit={guardarAnotacion}>
          <input
            name="estudiante"
            placeholder="Nombre del estudiante"
            value={form.estudiante}
            onChange={handleChange}
            required
          />

          <input
            name="descripcion"
            placeholder="Descripción de la anotación"
            value={form.descripcion}
            onChange={handleChange}
            required
          />

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

          <button type="submit" disabled={guardando}>
            {guardando ? "Guardando..." : "Crear anotación"}
          </button>
        </form>
      </section>

      <section className="admin-table-card">
        <div className="table-header">
          <div>
            <h2>Anotaciones registradas</h2>
            <p>Total: {anotacionesFiltradas.length}</p>
          </div>

          <input
            placeholder="Buscar anotación..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {cargando ? (
          <p>Cargando anotaciones...</p>
        ) : (
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
                  <td>{anotacion.idAnotacion}</td>
                  <td>{anotacion.estudiante}</td>
                  <td>{anotacion.descripcion}</td>
                  <td>{anotacion.tipo || "Sin tipo"}</td>
                  <td>{anotacion.fecha || "Sin fecha"}</td>
                  <td>{obtenerNombreAsignatura(anotacion)}</td>
                  <td>
                    <button onClick={() => borrarAnotacion(anotacion)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {anotacionesFiltradas.length === 0 && (
                <tr>
                  <td colSpan="7">
                    No hay anotaciones disponibles
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

export default GestionAnotaciones