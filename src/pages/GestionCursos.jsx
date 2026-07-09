import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import {
  listarCursos,
  crearCurso,
  actualizarCurso,
  eliminarCurso,
  listarNiveles,
  crearNivel,
  actualizarNivel,
  eliminarNivel,
} from "../services/cursoService"

import {
  canManageAcademicData,
  canDeleteRecords,
} from "../auth/roles"

const cursoInicial = {
  nombreCurso: "",
  descripcionCurso: "",
  idNivel: "",
}

const nivelInicial = {
  nombreNivel: "",
  descripcionNivel: "",
}

function GestionCursos({ user }) {
  const puedeGestionar = canManageAcademicData(user?.role)
  const puedeEliminar = canDeleteRecords(user?.role)

  const [cursos, setCursos] = useState([])
  const [niveles, setNiveles] = useState([])
  const [formCurso, setFormCurso] = useState(cursoInicial)
  const [formNivel, setFormNivel] = useState(nivelInicial)
  const [editandoCursoId, setEditandoCursoId] = useState(null)
  const [editandoNivelId, setEditandoNivelId] = useState(null)
  const [busqueda, setBusqueda] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [cargando, setCargando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [mostrarCurso, setMostrarCurso] = useState(false)
  const [mostrarNivel, setMostrarNivel] = useState(false)
  const [itemAEliminar, setItemAEliminar] = useState(null)

  useEffect(() => {
    cargarDatos()
  }, [])

  async function cargarDatos() {
    await cargarNiveles()
    await cargarCursos()
  }

  async function cargarCursos() {
    try {
      setCargando(true)

      const { data } = await listarCursos()

      setCursos(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error al cargar cursos:", error)

      const detalle =
        error.response?.data?.message ||
        error.response?.data?.error ||
        JSON.stringify(error.response?.data) ||
        error.message

      setMensaje(`Error al cargar cursos: ${detalle}`)
    } finally {
      setCargando(false)
    }
  }

  async function cargarNiveles() {
    try {
      const { data } = await listarNiveles()

      setNiveles(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error al cargar niveles:", error)
      setMensaje("Error al cargar niveles")
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

  function handleCursoChange(e) {
    const { name, value } = e.target

    setFormCurso({
      ...formCurso,
      [name]: name === "idNivel" ? Number(value) : value,
    })
  }

  function handleNivelChange(e) {
    const { name, value } = e.target

    setFormNivel({
      ...formNivel,
      [name]: value,
    })
  }

  function limpiarCurso() {
    setFormCurso(cursoInicial)
    setEditandoCursoId(null)
  }

  function limpiarNivel() {
    setFormNivel(nivelInicial)
    setEditandoNivelId(null)
  }

  function abrirNuevoNivel() {
    if (!puedeGestionar) return

    limpiarNivel()
    setMostrarNivel(true)
  }

  function cerrarNivel() {
    limpiarNivel()
    setMostrarNivel(false)
  }

  function abrirNuevoCurso() {
    if (!puedeGestionar) return

    limpiarCurso()
    setMostrarCurso(true)
  }

  function cerrarCurso() {
    limpiarCurso()
    setMostrarCurso(false)
  }

  async function guardarNivel(e) {
    e.preventDefault()

    if (!puedeGestionar) {
      setMensaje("No tienes permiso para guardar niveles")
      return
    }

    const payload = {
      nombreNivel: formNivel.nombreNivel.trim(),
      descripcionNivel: formNivel.descripcionNivel.trim(),
    }

    try {
      setMensaje("")

      if (editandoNivelId) {
        await actualizarNivel(editandoNivelId, payload)
        setMensaje("Nivel editado correctamente")
      } else {
        const { data } = await crearNivel(payload)
        setMensaje("Nivel creado correctamente")

        if (data?.idNivel) {
          setFormCurso({
            ...formCurso,
            idNivel: data.idNivel,
          })
        }
      }

      limpiarNivel()
      setMostrarNivel(false)
      await cargarNiveles()
    } catch (error) {
      setMensaje(`Error al guardar nivel: ${obtenerMensajeError(error)}`)
    }
  }

  function editarNivel(nivel) {
    if (!puedeGestionar) return

    setEditandoNivelId(nivel.idNivel)

    setFormNivel({
      nombreNivel: nivel.nombreNivel || "",
      descripcionNivel: nivel.descripcionNivel || "",
    })

    setMensaje("Editando nivel")
    setMostrarNivel(true)
  }

  function solicitarEliminarNivel(nivel) {
    if (!puedeEliminar) return

    setItemAEliminar({
      tipo: "nivel",
      nombre: nivel.nombreNivel,
      item: nivel,
    })
  }

  async function guardarCurso(e) {
    e.preventDefault()

    if (!puedeGestionar) {
      setMensaje("No tienes permiso para guardar cursos")
      return
    }

    if (!formCurso.idNivel) {
      setMensaje("Primero debes seleccionar un nivel")
      return
    }

    const payload = {
      nombreCurso: formCurso.nombreCurso.trim(),
      descripcionCurso: formCurso.descripcionCurso.trim(),
      idNivel: Number(formCurso.idNivel),
    }

    try {
      setGuardando(true)
      setMensaje("")

      if (editandoCursoId) {
        await actualizarCurso(editandoCursoId, payload)
        setMensaje("Curso editado correctamente")
      } else {
        await crearCurso(payload)
        setMensaje("Curso creado correctamente")
      }

      limpiarCurso()
      setMostrarCurso(false)
      await cargarCursos()
    } catch (error) {
      setMensaje(`Error al guardar curso: ${obtenerMensajeError(error)}`)
    } finally {
      setGuardando(false)
    }
  }

  function editarCurso(curso) {
    if (!puedeGestionar) return

    setEditandoCursoId(curso.idCurso)

    setFormCurso({
      nombreCurso: curso.nombreCurso || "",
      descripcionCurso: curso.descripcionCurso || "",
      idNivel: curso.nivel?.idNivel || "",
    })

    setMensaje("Editando curso")
    setMostrarCurso(true)
  }

  function solicitarEliminarCurso(curso) {
    if (!puedeEliminar) return

    setItemAEliminar({
      tipo: "curso",
      nombre: curso.nombreCurso,
      item: curso,
    })
  }

  function cancelarEliminar() {
    setItemAEliminar(null)
  }

  async function confirmarEliminar() {
    if (!itemAEliminar || !puedeEliminar) return

    try {
      setMensaje("")

      if (itemAEliminar.tipo === "nivel") {
        await eliminarNivel(itemAEliminar.item.idNivel)
        setMensaje("Nivel eliminado correctamente")

        await cargarNiveles()
        await cargarCursos()
      }

      if (itemAEliminar.tipo === "curso") {
        await eliminarCurso(itemAEliminar.item.idCurso)
        setMensaje("Curso eliminado correctamente")

        await cargarCursos()
      }

      setItemAEliminar(null)
    } catch (error) {
      setMensaje(
        `Error al eliminar ${itemAEliminar.tipo}: ${obtenerMensajeError(error)}`
      )
    }
  }

  function obtenerNombreNivel(curso) {
    return (
      curso.nivel?.nombreNivel ||
      curso.nivel?.descripcionNivel ||
      curso.nivel?.idNivel ||
      "Sin nivel"
    )
  }

  const cursosFiltrados = cursos.filter((curso) => {
    const texto = [
      curso.idCurso,
      curso.nombreCurso,
      curso.descripcionCurso,
      obtenerNombreNivel(curso),
    ]
      .join(" ")
      .toLowerCase()

    return texto.includes(busqueda.toLowerCase())
  })

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <span className="page-tag">CURSOS</span>

          <h1>📚 Gestión de Cursos</h1>

          <p>
            Aquí puedes revisar los cursos y niveles del establecimiento.
          </p>

          {!puedeGestionar && (
            <p className="readonly-message">
              Vista de solo lectura para tu rol.
            </p>
          )}
        </div>

        <div className="header-buttons">
          {puedeGestionar && (
            <>
              <button
                className="new-user-btn"
                type="button"
                onClick={abrirNuevoNivel}
              >
                ➕ Nuevo Nivel
              </button>

              <button
                className="new-user-btn"
                type="button"
                onClick={abrirNuevoCurso}
              >
                ➕ Nuevo Curso
              </button>
            </>
          )}

          <Link className="back-button" to="/">
            ⬅ Dashboard
          </Link>
        </div>
      </header>

      {mensaje && (
        <div
          className={
            mensaje.toLowerCase().includes("error") ||
            mensaje.toLowerCase().includes("no tienes") ||
            mensaje.toLowerCase().includes("primero")
              ? "alert alert-error"
              : mensaje.toLowerCase().includes("editando")
                ? "alert alert-info"
                : "alert alert-success"
          }
        >
          <span>
            {mensaje.toLowerCase().includes("error") ||
            mensaje.toLowerCase().includes("no tienes") ||
            mensaje.toLowerCase().includes("primero")
              ? "⚠️"
              : mensaje.toLowerCase().includes("editando")
                ? "✏️"
                : "✅"}
          </span>

          <p>{mensaje}</p>
        </div>
      )}

      <section className="users-summary-grid">
        <article className="users-summary-card">
          <span>📚</span>
          <div>
            <h3>{cursos.length}</h3>
            <p>Total cursos</p>
          </div>
        </article>

        <article className="users-summary-card">
          <span>🏫</span>
          <div>
            <h3>{niveles.length}</h3>
            <p>Niveles</p>
          </div>
        </article>

        <article className="users-summary-card">
          <span>🔎</span>
          <div>
            <h3>{cursosFiltrados.length}</h3>
            <p>Resultados</p>
          </div>
        </article>

        <article className="users-summary-card">
          <span>✅</span>
          <div>
            <h3>{cursos.filter((curso) => curso.nivel?.idNivel).length}</h3>
            <p>Con nivel asignado</p>
          </div>
        </article>
      </section>

      {mostrarNivel && puedeGestionar && (
        <div className="modal-overlay">
          <section className="admin-form-card modal-card small-modal-card">
            <button
              className="modal-close"
              type="button"
              onClick={cerrarNivel}
            >
              ✕
            </button>

            <div className="form-title-box">
              <span className="page-tag">
                {editandoNivelId ? "EDITANDO" : "NUEVO NIVEL"}
              </span>

              <h2>
                {editandoNivelId
                  ? `Editar nivel #${editandoNivelId}`
                  : "Crear nuevo nivel"}
              </h2>

              <p>
                Registra un nivel educativo para asociarlo a los cursos.
              </p>
            </div>

            <form className="user-form" onSubmit={guardarNivel}>
              <label className="form-field">
                <span>Nombre del nivel</span>
                <input
                  name="nombreNivel"
                  placeholder="Ej: Básica, Media, Prekínder..."
                  value={formNivel.nombreNivel}
                  onChange={handleNivelChange}
                  required
                />
              </label>

              <label className="form-field">
                <span>Descripción del nivel</span>
                <input
                  name="descripcionNivel"
                  placeholder="Descripción del nivel"
                  value={formNivel.descripcionNivel}
                  onChange={handleNivelChange}
                  required
                />
              </label>

              <div className="form-actions full-width">
                <button className="save-user-btn" type="submit">
                  {editandoNivelId ? "Guardar nivel" : "Crear nivel"}
                </button>

                <button
                  className="cancel-user-btn"
                  type="button"
                  onClick={cerrarNivel}
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
            <span className="page-tag">NIVELES</span>

            <h2>Niveles registrados</h2>

            <p>
              Total: <strong>{niveles.length}</strong>
            </p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nivel</th>
                <th>Descripción</th>

                {(puedeGestionar || puedeEliminar) && <th>Acciones</th>}
              </tr>
            </thead>

            <tbody>
              {niveles.map((nivel) => (
                <tr key={nivel.idNivel}>
                  <td>
                    <span className="id-badge">#{nivel.idNivel}</span>
                  </td>

                  <td>
                    <div className="course-title-cell">
                      <div className="user-table-avatar">
                        {nivel.nombreNivel?.charAt(0).toUpperCase()}
                      </div>

                      <strong>{nivel.nombreNivel}</strong>
                    </div>
                  </td>

                  <td>
                    <span className="description-cell">
                      {nivel.descripcionNivel}
                    </span>
                  </td>

                  {(puedeGestionar || puedeEliminar) && (
                    <td>
                      <div className="action-buttons">
                        {puedeGestionar && (
                          <button
                            className="edit-btn"
                            type="button"
                            onClick={() => editarNivel(nivel)}
                          >
                            Editar
                          </button>
                        )}

                        {puedeEliminar && (
                          <button
                            className="delete-btn"
                            type="button"
                            onClick={() => solicitarEliminarNivel(nivel)}
                          >
                            Eliminar
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}

              {niveles.length === 0 && (
                <tr>
                  <td
                    colSpan={puedeGestionar || puedeEliminar ? "4" : "3"}
                    className="empty-table"
                  >
                    No hay niveles disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {mostrarCurso && puedeGestionar && (
        <div className="modal-overlay">
          <section className="admin-form-card modal-card small-modal-card">
            <button
              className="modal-close"
              type="button"
              onClick={cerrarCurso}
            >
              ✕
            </button>

            <div className="form-title-box">
              <span className="page-tag">
                {editandoCursoId ? "EDITANDO" : "NUEVO CURSO"}
              </span>

              <h2>
                {editandoCursoId
                  ? `Editar curso #${editandoCursoId}`
                  : "Crear nuevo curso"}
              </h2>

              <p>
                Completa los datos del curso y asígnalo a un nivel educativo.
              </p>
            </div>

            <form className="user-form" onSubmit={guardarCurso}>
              <label className="form-field">
                <span>Nombre del curso</span>

                <input
                  name="nombreCurso"
                  placeholder="Ej: 4° Básico A"
                  value={formCurso.nombreCurso}
                  onChange={handleCursoChange}
                  required
                />
              </label>

              <label className="form-field">
                <span>Descripción del curso</span>

                <input
                  name="descripcionCurso"
                  placeholder="Ej: Curso de enseñanza básica"
                  value={formCurso.descripcionCurso}
                  onChange={handleCursoChange}
                  required
                />
              </label>

              <label className="form-field full-width">
                <span>Nivel educativo</span>

                <select
                  name="idNivel"
                  value={formCurso.idNivel}
                  onChange={handleCursoChange}
                  required
                >
                  <option value="">Selecciona un nivel</option>

                  {niveles.map((nivel) => (
                    <option key={nivel.idNivel} value={nivel.idNivel}>
                      {nivel.nombreNivel}
                    </option>
                  ))}
                </select>
              </label>

              <div className="form-actions full-width">
                <button
                  className="save-user-btn"
                  type="submit"
                  disabled={guardando}
                >
                  {guardando
                    ? "Guardando..."
                    : editandoCursoId
                      ? "Guardar cambios"
                      : "Crear curso"}
                </button>

                <button
                  className="cancel-user-btn"
                  type="button"
                  onClick={cerrarCurso}
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
            <span className="page-tag">CURSOS</span>

            <h2>Cursos registrados</h2>

            <p>
              Total encontrados: <strong>{cursosFiltrados.length}</strong>
            </p>
          </div>

          <div className="table-tools">
            <div className="search-container">
              <input
                className="search-input"
                type="text"
                placeholder="🔍 Buscar por curso, nivel o descripción..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>
        </div>

        {cargando ? (
          <div className="loading-box">Cargando cursos...</div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Curso</th>
                  <th>Descripción</th>
                  <th>Nivel</th>

                  {(puedeGestionar || puedeEliminar) && <th>Acciones</th>}
                </tr>
              </thead>

              <tbody>
                {cursosFiltrados.map((curso) => (
                  <tr key={curso.idCurso}>
                    <td>
                      <span className="id-badge">#{curso.idCurso}</span>
                    </td>

                    <td>
                      <div className="course-title-cell">
                        <div className="course-avatar">📚</div>

                        <strong>{curso.nombreCurso}</strong>
                      </div>
                    </td>

                    <td>
                      <span className="description-cell">
                        {curso.descripcionCurso}
                      </span>
                    </td>

                    <td>
                      <span className="level-badge">
                        {obtenerNombreNivel(curso)}
                      </span>
                    </td>

                    {(puedeGestionar || puedeEliminar) && (
                      <td>
                        <div className="action-buttons">
                          {puedeGestionar && (
                            <button
                              className="edit-btn"
                              type="button"
                              onClick={() => editarCurso(curso)}
                            >
                              Editar
                            </button>
                          )}

                          {puedeEliminar && (
                            <button
                              className="delete-btn"
                              type="button"
                              onClick={() => solicitarEliminarCurso(curso)}
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}

                {cursosFiltrados.length === 0 && (
                  <tr>
                    <td
                      colSpan={puedeGestionar || puedeEliminar ? "5" : "4"}
                      className="empty-table"
                    >
                      No hay cursos disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {itemAEliminar && puedeEliminar && (
        <div className="modal-overlay">
          <section className="confirm-modal">
            <div className="confirm-icon">⚠️</div>

            <h2>Eliminar {itemAEliminar.tipo}</h2>

            <p>
              ¿Seguro que deseas eliminar{" "}
              <strong>{itemAEliminar.nombre}</strong>?
            </p>

            <div className="confirm-actions">
              <button
                className="cancel-delete-btn"
                type="button"
                onClick={cancelarEliminar}
              >
                Cancelar
              </button>

              <button
                className="confirm-delete-btn"
                type="button"
                onClick={confirmarEliminar}
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

export default GestionCursos