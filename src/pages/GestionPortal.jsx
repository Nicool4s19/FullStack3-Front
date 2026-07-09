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
      await cargarEventos()
    } catch (error) {
      setMensaje(`Error al crear evento: ${obtenerMensajeError(error)}`)
    } finally {
      setGuardando(false)
    }
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
          <h1>Portal Informativo</h1>
          <p>Mural digital y calendario estudiantil.</p>
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
        <h2>Crear publicación en mural</h2>

        <form className="user-form" onSubmit={guardarPublicacion}>
          <input
            name="titulo"
            placeholder="Título"
            value={formMural.titulo}
            onChange={handleMuralChange}
            required
            maxLength="150"
          />

          <input
            name="contenido"
            placeholder="Contenido"
            value={formMural.contenido}
            onChange={handleMuralChange}
            required
          />

          <input
            name="autor"
            placeholder="Autor"
            value={formMural.autor}
            onChange={handleMuralChange}
            required
            maxLength="100"
          />

          <button type="submit" disabled={guardando}>
            {guardando ? "Guardando..." : "Crear publicación"}
          </button>
        </form>
      </section>

      <section className="admin-form-card">
        <h2>Crear evento calendario</h2>

        <form className="user-form" onSubmit={guardarEvento}>
          <input
            name="evento"
            placeholder="Nombre del evento"
            value={formEvento.evento}
            onChange={handleEventoChange}
            required
            maxLength="100"
          />

          <input
            name="descripcion"
            placeholder="Descripción"
            value={formEvento.descripcion}
            onChange={handleEventoChange}
          />

          <input
            name="fechaInicio"
            type="date"
            value={formEvento.fechaInicio}
            onChange={handleEventoChange}
            required
          />

          <input
            name="fechaFin"
            type="date"
            value={formEvento.fechaFin}
            onChange={handleEventoChange}
          />

          <input
            name="categoria"
            placeholder="Categoría"
            value={formEvento.categoria}
            onChange={handleEventoChange}
            required
            maxLength="50"
          />

          <button type="submit" disabled={guardando}>
            {guardando ? "Guardando..." : "Crear evento"}
          </button>
        </form>
      </section>

      <section className="admin-table-card">
        <div className="table-header">
          <div>
            <h2>Buscar registros</h2>
            <p>
              Publicaciones: {muralFiltrado.length} | Eventos: {eventosFiltrados.length}
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
        <h2>Mural digital</h2>

        {cargando ? (
          <p>Cargando...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Contenido</th>
                <th>Autor</th>
                <th>Fecha publicación</th>
              </tr>
            </thead>

            <tbody>
              {muralFiltrado.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.titulo}</td>
                  <td>{item.contenido}</td>
                  <td>{item.autor}</td>
                  <td>{item.fechaPublicacion || "Sin fecha"}</td>
                </tr>
              ))}

              {muralFiltrado.length === 0 && (
                <tr>
                  <td colSpan="5">
                    No hay publicaciones disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>

      <section className="admin-table-card">
        <h2>Calendario estudiantil</h2>

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
                <td>{item.id}</td>
                <td>{item.evento}</td>
                <td>{item.descripcion || "Sin descripción"}</td>
                <td>{item.fechaInicio}</td>
                <td>{item.fechaFin || "Sin fecha fin"}</td>
                <td>{item.categoria}</td>
              </tr>
            ))}

            {eventosFiltrados.length === 0 && (
              <tr>
                <td colSpan="6">
                  No hay eventos disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  )
}

export default GestionPortal