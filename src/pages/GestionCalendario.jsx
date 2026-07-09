import { useMemo, useState } from "react"
import { Link } from "react-router-dom"

import { canManageCalendar } from "../auth/roles"

const eventosIniciales = [
  {
    id: 1,
    titulo: "Reunión de apoderados",
    tipo: "Reunión",
    fecha: "2026-07-15",
    hora: "18:00",
    descripcion: "Reunión general con apoderados del establecimiento.",
  },
  {
    id: 2,
    titulo: "Evaluaciones semestrales",
    tipo: "Evaluación",
    fecha: "2026-07-22",
    hora: "08:30",
    descripcion: "Inicio del periodo de evaluaciones semestrales.",
  },
  {
    id: 3,
    titulo: "Actividad deportiva",
    tipo: "Actividad",
    fecha: "2026-07-29",
    hora: "10:00",
    descripcion: "Jornada deportiva para estudiantes.",
  },
]

const eventoInicial = {
  titulo: "",
  tipo: "Actividad",
  fecha: "",
  hora: "",
  descripcion: "",
}

function GestionCalendario({ user }) {
  const puedeGestionarCalendario = canManageCalendar(user?.role)

  const [eventos, setEventos] = useState(eventosIniciales)
  const [form, setForm] = useState(eventoInicial)
  const [busqueda, setBusqueda] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [eventoAEliminar, setEventoAEliminar] = useState(null)

  const hoy = new Date().toISOString().slice(0, 10)

  const eventosFiltrados = useMemo(() => {
    return eventos.filter((evento) => {
      const texto = [
        evento.id,
        evento.titulo,
        evento.tipo,
        evento.fecha,
        evento.hora,
        evento.descripcion,
      ]
        .join(" ")
        .toLowerCase()

      return texto.includes(busqueda.toLowerCase())
    })
  }, [eventos, busqueda])

  const eventosProximos = eventos.filter((evento) => evento.fecha >= hoy).length

  const eventosReuniones = eventos.filter(
    (evento) => evento.tipo.toLowerCase() === "reunión"
  ).length

  const eventosEvaluaciones = eventos.filter(
    (evento) => evento.tipo.toLowerCase() === "evaluación"
  ).length

  function handleChange(e) {
    const { name, value } = e.target

    setForm({
      ...form,
      [name]: value,
    })
  }

  function abrirFormulario() {
    if (!puedeGestionarCalendario) return

    setForm(eventoInicial)
    setMostrarFormulario(true)
  }

  function cerrarFormulario() {
    setForm(eventoInicial)
    setMostrarFormulario(false)
  }

  function guardarEvento(e) {
    e.preventDefault()

    if (!puedeGestionarCalendario) {
      setMensaje("No tienes permiso para crear eventos")
      return
    }

    const nuevoEvento = {
      id: Date.now(),
      titulo: form.titulo.trim(),
      tipo: form.tipo,
      fecha: form.fecha,
      hora: form.hora,
      descripcion: form.descripcion.trim(),
    }

    setEventos([nuevoEvento, ...eventos])
    setMensaje("Evento agregado correctamente")
    cerrarFormulario()
  }

  function solicitarEliminarEvento(evento) {
    if (!puedeGestionarCalendario) return

    setEventoAEliminar(evento)
  }

  function cancelarEliminarEvento() {
    setEventoAEliminar(null)
  }

  function confirmarEliminarEvento() {
    if (!eventoAEliminar || !puedeGestionarCalendario) return

    setEventos(eventos.filter((evento) => evento.id !== eventoAEliminar.id))
    setMensaje("Evento eliminado correctamente")
    setEventoAEliminar(null)
  }

  function formatearFecha(fecha) {
    if (!fecha) return "Sin fecha"

    return new Date(`${fecha}T00:00:00`).toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  }

  function obtenerClaseTipo(tipo) {
    return tipo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <span className="page-tag">CALENDARIO</span>

          <h1>📅 Calendario Institucional</h1>

          <p>
            Revisa eventos, actividades, evaluaciones y fechas importantes.
          </p>

          {!puedeGestionarCalendario && (
            <p className="readonly-message">
              Vista de solo lectura para tu rol.
            </p>
          )}
        </div>

        <div className="header-buttons">
          {puedeGestionarCalendario && (
            <button
              className="new-user-btn"
              type="button"
              onClick={abrirFormulario}
            >
              ➕ Nuevo Evento
            </button>
          )}

          <Link className="back-button" to="/">
            ⬅ Dashboard
          </Link>
        </div>
      </header>

      {mensaje && (
        <div
          className={
            mensaje.toLowerCase().includes("no tienes")
              ? "alert alert-error"
              : "alert alert-success"
          }
        >
          <span>
            {mensaje.toLowerCase().includes("no tienes") ? "⚠️" : "✅"}
          </span>

          <p>{mensaje}</p>
        </div>
      )}

      <section className="users-summary-grid">
        <article className="users-summary-card">
          <span>📅</span>
          <div>
            <h3>{eventos.length}</h3>
            <p>Total eventos</p>
          </div>
        </article>

        <article className="users-summary-card">
          <span>⏳</span>
          <div>
            <h3>{eventosProximos}</h3>
            <p>Próximos</p>
          </div>
        </article>

        <article className="users-summary-card">
          <span>👥</span>
          <div>
            <h3>{eventosReuniones}</h3>
            <p>Reuniones</p>
          </div>
        </article>

        <article className="users-summary-card">
          <span>📝</span>
          <div>
            <h3>{eventosEvaluaciones}</h3>
            <p>Evaluaciones</p>
          </div>
        </article>
      </section>

      {mostrarFormulario && puedeGestionarCalendario && (
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
              <span className="page-tag">NUEVO EVENTO</span>

              <h2>Crear evento</h2>

              <p>
                Registra una fecha importante para el calendario institucional.
              </p>
            </div>

            <form className="user-form" onSubmit={guardarEvento}>
              <label className="form-field">
                <span>Título del evento</span>

                <input
                  name="titulo"
                  placeholder="Ej: Reunión de apoderados"
                  value={form.titulo}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="form-field">
                <span>Tipo de evento</span>

                <select
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  required
                >
                  <option value="Actividad">Actividad</option>
                  <option value="Reunión">Reunión</option>
                  <option value="Evaluación">Evaluación</option>
                  <option value="Feriado">Feriado</option>
                  <option value="Informativo">Informativo</option>
                </select>
              </label>

              <label className="form-field">
                <span>Fecha</span>

                <input
                  name="fecha"
                  type="date"
                  value={form.fecha}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="form-field">
                <span>Hora</span>

                <input
                  name="hora"
                  type="time"
                  value={form.hora}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="form-field full-width">
                <span>Descripción</span>

                <textarea
                  name="descripcion"
                  placeholder="Descripción del evento..."
                  value={form.descripcion}
                  onChange={handleChange}
                  required
                />
              </label>

              <div className="form-actions full-width">
                <button className="save-user-btn" type="submit">
                  Crear evento
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
            <span className="page-tag">CALENDARIO</span>

            <h2>Eventos registrados</h2>

            <p>
              Total encontrados: <strong>{eventosFiltrados.length}</strong>
            </p>
          </div>

          <div className="table-tools">
            <div className="search-container">
              <input
                className="search-input"
                type="text"
                placeholder="🔍 Buscar por título, tipo, fecha o descripción..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="calendar-grid">
          {eventosFiltrados.map((evento) => (
            <article className="calendar-event-card" key={evento.id}>
              <div className="calendar-date-box">
                <span>{evento.fecha?.slice(8, 10) || "--"}</span>

                <p>
                  {evento.fecha
                    ? new Date(`${evento.fecha}T00:00:00`).toLocaleDateString(
                        "es-CL",
                        {
                          month: "short",
                        }
                      )
                    : "N/A"}
                </p>
              </div>

              <div className="calendar-event-content">
                <div className="calendar-event-top">
                  <span
                    className={`calendar-type-badge calendar-type-${obtenerClaseTipo(
                      evento.tipo
                    )}`}
                  >
                    {evento.tipo}
                  </span>

                  <span className="calendar-hour">🕒 {evento.hora}</span>
                </div>

                <h3>{evento.titulo}</h3>

                <p>{evento.descripcion}</p>

                <div className="calendar-event-footer">
                  <span>📆 {formatearFecha(evento.fecha)}</span>

                  {puedeGestionarCalendario && (
                    <button
                      className="delete-btn"
                      type="button"
                      onClick={() => solicitarEliminarEvento(evento)}
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}

          {eventosFiltrados.length === 0 && (
            <div className="empty-calendar">
              No hay eventos disponibles
            </div>
          )}
        </div>
      </section>

      {eventoAEliminar && puedeGestionarCalendario && (
        <div className="modal-overlay">
          <section className="confirm-modal">
            <div className="confirm-icon">⚠️</div>

            <h2>Eliminar evento</h2>

            <p>
              ¿Seguro que deseas eliminar{" "}
              <strong>{eventoAEliminar.titulo}</strong>?
            </p>

            <div className="confirm-actions">
              <button
                className="cancel-delete-btn"
                type="button"
                onClick={cancelarEliminarEvento}
              >
                Cancelar
              </button>

              <button
                className="confirm-delete-btn"
                type="button"
                onClick={confirmarEliminarEvento}
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

export default GestionCalendario