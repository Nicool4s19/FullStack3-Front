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

  function normalizarFecha(fecha) {
  if (!fecha) return ""

  const fechaConvertida = new Date(fecha)

  return fechaConvertida.toISOString()
}

  function fechaParaInput(fecha) {
    if (!fecha) return ""
    return fecha.slice(0, 16)
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
  }

  async function borrarReunion(reunion) {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar la reunión ${reunion.titulo}?`
    )

    if (!confirmar) return

    try {
      setMensaje("")
      await eliminarReunion(reunion.id)
      setMensaje("Reunión eliminada correctamente")
      await cargarReuniones()
    } catch (error) {
      setMensaje(`Error al eliminar reunión: ${obtenerMensajeError(error)}`)
    }
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
  }

  async function borrarCitacion(citacion) {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar la citación de ${citacion.nombreApoderado}?`
    )

    if (!confirmar) return

    try {
      setMensaje("")
      await eliminarCitacion(citacion.id)
      setMensaje("Citación eliminada correctamente")
      await cargarCitaciones()
    } catch (error) {
      setMensaje(`Error al eliminar citación: ${obtenerMensajeError(error)}`)
    }
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
  }

  async function borrarBitacora(bitacora) {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar la bitácora ${bitacora.tema}?`
    )

    if (!confirmar) return

    try {
      setMensaje("")
      await eliminarBitacoraGeneral(bitacora.id)
      setMensaje("Bitácora eliminada correctamente")
      await cargarBitacoras()
    } catch (error) {
      setMensaje(`Error al eliminar bitácora: ${obtenerMensajeError(error)}`)
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
          <h1>Gestión de Reuniones</h1>
          <p>Reuniones, citaciones de apoderados y bitácora general.</p>
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
          {editandoReunionId ? `Editar reunión #${editandoReunionId}` : "Crear reunión"}
        </h2>

        <form className="user-form" onSubmit={guardarReunion}>
          <input
            name="titulo"
            placeholder="Título"
            value={formReunion.titulo}
            onChange={handleReunionChange}
            required
          />

          <input
            name="descripcion"
            placeholder="Descripción"
            value={formReunion.descripcion}
            onChange={handleReunionChange}
            required
          />

          <input
            name="encargado"
            placeholder="Encargado"
            value={formReunion.encargado}
            onChange={handleReunionChange}
            required
          />

          <input
            name="fechaReunion"
            type="datetime-local"
            value={formReunion.fechaReunion}
            onChange={handleReunionChange}
            required
          />

          <button type="submit" disabled={guardando}>
            {guardando ? "Guardando..." : editandoReunionId ? "Guardar reunión" : "Crear reunión"}
          </button>

          {editandoReunionId && (
            <button type="button" onClick={limpiarReunion}>
              Cancelar edición
            </button>
          )}
        </form>
      </section>

      <section className="admin-form-card">
        <h2>
          {editandoCitacionId ? `Editar citación #${editandoCitacionId}` : "Crear citación"}
        </h2>

        <form className="user-form" onSubmit={guardarCitacion}>
          <input
            name="nombreApoderado"
            placeholder="Nombre apoderado"
            value={formCitacion.nombreApoderado}
            onChange={handleCitacionChange}
            required
          />

          <input
            name="nombreEstudiante"
            placeholder="Nombre estudiante"
            value={formCitacion.nombreEstudiante}
            onChange={handleCitacionChange}
            required
          />

          <input
            name="motivo"
            placeholder="Motivo"
            value={formCitacion.motivo}
            onChange={handleCitacionChange}
            required
          />

          <input
            name="fechaCitacion"
            type="datetime-local"
            value={formCitacion.fechaCitacion}
            onChange={handleCitacionChange}
            required
          />

          <button type="submit" disabled={guardando}>
            {guardando ? "Guardando..." : editandoCitacionId ? "Guardar citación" : "Crear citación"}
          </button>

          {editandoCitacionId && (
            <button type="button" onClick={limpiarCitacion}>
              Cancelar edición
            </button>
          )}
        </form>
      </section>

      <section className="admin-form-card">
        <h2>
          {editandoBitacoraId ? `Editar bitácora #${editandoBitacoraId}` : "Crear bitácora general"}
        </h2>

        <form className="user-form" onSubmit={guardarBitacora}>
          <input
            name="tema"
            placeholder="Tema"
            value={formBitacora.tema}
            onChange={handleBitacoraChange}
            required
          />

          <input
            name="observacion"
            placeholder="Observación"
            value={formBitacora.observacion}
            onChange={handleBitacoraChange}
            required
          />

          <input
            name="participantes"
            placeholder="Participantes"
            value={formBitacora.participantes}
            onChange={handleBitacoraChange}
            required
          />

          <button type="submit" disabled={guardando}>
            {guardando ? "Guardando..." : editandoBitacoraId ? "Guardar bitácora" : "Crear bitácora"}
          </button>

          {editandoBitacoraId && (
            <button type="button" onClick={limpiarBitacora}>
              Cancelar edición
            </button>
          )}
        </form>
      </section>

      <section className="admin-table-card">
        <div className="table-header">
          <div>
            <h2>Buscar registros</h2>
            <p>
              Reuniones: {reunionesFiltradas.length} | Citaciones: {citacionesFiltradas.length} | Bitácoras: {bitacorasFiltradas.length}
            </p>
          </div>

          <input
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </section>

      <section className="admin-table-card">
        <h2>Reuniones registradas</h2>

        {cargando ? (
          <p>Cargando...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
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
                  <td>{item.id}</td>
                  <td>{item.titulo}</td>
                  <td>{item.descripcion}</td>
                  <td>{item.encargado}</td>
                  <td>{item.fechaReunion}</td>
                  <td>{item.estado || "Sin estado"}</td>
                  <td>
                    <button onClick={() => editarReunion(item)}>
                      Editar
                    </button>

                    <button onClick={() => borrarReunion(item)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {reunionesFiltradas.length === 0 && (
                <tr>
                  <td colSpan="7">
                    No hay reuniones disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>

      <section className="admin-table-card">
        <h2>Citaciones registradas</h2>

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
                <td>{item.id}</td>
                <td>{item.nombreApoderado}</td>
                <td>{item.nombreEstudiante}</td>
                <td>{item.motivo}</td>
                <td>{item.fechaCitacion}</td>
                <td>{item.estado || "Sin estado"}</td>
                <td>
                  <button onClick={() => editarCitacion(item)}>
                    Editar
                  </button>

                  <button onClick={() => borrarCitacion(item)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {citacionesFiltradas.length === 0 && (
              <tr>
                <td colSpan="7">
                  No hay citaciones disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="admin-table-card">
        <h2>Bitácora general</h2>

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
                <td>{item.id}</td>
                <td>{item.tema}</td>
                <td>{item.observacion}</td>
                <td>{item.participantes}</td>
                <td>{item.fechaRegistro || "Sin fecha"}</td>
                <td>
                  <button onClick={() => editarBitacora(item)}>
                    Editar
                  </button>

                  <button onClick={() => borrarBitacora(item)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {bitacorasFiltradas.length === 0 && (
              <tr>
                <td colSpan="6">
                  No hay bitácoras disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  )
}

export default GestionReuniones