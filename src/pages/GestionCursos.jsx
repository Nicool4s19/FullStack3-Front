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

const cursoInicial = {
  nombreCurso: "",
  descripcionCurso: "",
  idNivel: "",
}

const nivelInicial = {
  nombreNivel: "",
  descripcionNivel: "",
}

function GestionCursos() {
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

  async function guardarNivel(e) {
    e.preventDefault()

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
      await cargarNiveles()
    } catch (error) {
      setMensaje(`Error al guardar nivel: ${obtenerMensajeError(error)}`)
    }
  }

  function editarNivel(nivel) {
    setEditandoNivelId(nivel.idNivel)

    setFormNivel({
      nombreNivel: nivel.nombreNivel || "",
      descripcionNivel: nivel.descripcionNivel || "",
    })

    setMensaje("Editando nivel")
  }

  async function borrarNivel(nivel) {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar el nivel ${nivel.nombreNivel}?`
    )

    if (!confirmar) return

    try {
      await eliminarNivel(nivel.idNivel)
      setMensaje("Nivel eliminado correctamente")
      await cargarNiveles()
      await cargarCursos()
    } catch (error) {
      setMensaje(`Error al eliminar nivel: ${obtenerMensajeError(error)}`)
    }
  }

  async function guardarCurso(e) {
    e.preventDefault()

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
      await cargarCursos()
    } catch (error) {
      setMensaje(`Error al guardar curso: ${obtenerMensajeError(error)}`)
    } finally {
      setGuardando(false)
    }
  }

  function editarCurso(curso) {
    setEditandoCursoId(curso.idCurso)

    setFormCurso({
      nombreCurso: curso.nombreCurso || "",
      descripcionCurso: curso.descripcionCurso || "",
      idNivel: curso.nivel?.idNivel || "",
    })

    setMensaje("Editando curso")
  }

  async function borrarCurso(curso) {
  const confirmar = window.confirm(
    `¿Seguro que deseas eliminar el curso ${curso.nombreCurso}?`
  )

  if (!confirmar) return

  try {
    setMensaje("")

    await eliminarCurso(curso.idCurso)

    setMensaje("Curso eliminado correctamente")
    await cargarCursos()
  } catch (error) {
    console.error("Error al eliminar curso:", error)

    const detalle =
      error.response?.data?.message ||
      error.response?.data?.error ||
      JSON.stringify(error.response?.data) ||
      error.message

    setMensaje(`Error al eliminar curso: ${detalle}`)
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
          <h1>Gestión de Cursos</h1>
          <p>Crear, editar, buscar y eliminar cursos.</p>
        </div>

        <Link className="back-button" to="/">
          Volver
        </Link>
      </header>

      {mensaje && <div className="alert">{mensaje}</div>}

      <section className="admin-form-card">
        <h2>
          {editandoNivelId ? `Editar nivel #${editandoNivelId}` : "Crear nivel"}
        </h2>

        <form className="user-form" onSubmit={guardarNivel}>
          <input
            name="nombreNivel"
            placeholder="Nombre del nivel"
            value={formNivel.nombreNivel}
            onChange={handleNivelChange}
            required
          />

          <input
            name="descripcionNivel"
            placeholder="Descripción del nivel"
            value={formNivel.descripcionNivel}
            onChange={handleNivelChange}
            required
          />

          <button type="submit">
            {editandoNivelId ? "Guardar nivel" : "Crear nivel"}
          </button>

          {editandoNivelId && (
            <button type="button" onClick={limpiarNivel}>
              Cancelar edición
            </button>
          )}
        </form>
      </section>

      <section className="admin-table-card">
        <h2>Niveles registrados</h2>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nivel</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {niveles.map((nivel) => (
              <tr key={nivel.idNivel}>
                <td>{nivel.idNivel}</td>
                <td>{nivel.nombreNivel}</td>
                <td>{nivel.descripcionNivel}</td>
                <td>
                  <button onClick={() => editarNivel(nivel)}>
                    Editar
                  </button>

                  <button onClick={() => borrarNivel(nivel)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {niveles.length === 0 && (
              <tr>
                <td colSpan="4">No hay niveles disponibles</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      <section className="admin-form-card">
        <h2>
          {editandoCursoId ? `Editar curso #${editandoCursoId}` : "Crear curso"}
        </h2>

        <form className="user-form" onSubmit={guardarCurso}>
          <input
            name="nombreCurso"
            placeholder="Nombre del curso"
            value={formCurso.nombreCurso}
            onChange={handleCursoChange}
            required
          />

          <input
            name="descripcionCurso"
            placeholder="Descripción del curso"
            value={formCurso.descripcionCurso}
            onChange={handleCursoChange}
            required
          />

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

          <button type="submit" disabled={guardando}>
            {guardando
              ? "Guardando..."
              : editandoCursoId
                ? "Guardar cambios"
                : "Crear curso"}
          </button>

          {editandoCursoId && (
            <button type="button" onClick={limpiarCurso}>
              Cancelar edición
            </button>
          )}
        </form>
      </section>

      <section className="admin-table-card">
        <div className="table-header">
          <div>
            <h2>Cursos registrados</h2>
            <p>Total: {cursosFiltrados.length}</p>
          </div>

          <input
            placeholder="Buscar curso..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {cargando ? (
          <p>Cargando cursos...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Curso</th>
                <th>Descripción</th>
                <th>Nivel</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {cursosFiltrados.map((curso) => (
                <tr key={curso.idCurso}>
                  <td>{curso.idCurso}</td>
                  <td>{curso.nombreCurso}</td>
                  <td>{curso.descripcionCurso}</td>
                  <td>{obtenerNombreNivel(curso)}</td>
                  <td>
                    <button onClick={() => editarCurso(curso)}>
                      Editar
                    </button>

                    <button onClick={() => borrarCurso(curso)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {cursosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="5">No hay cursos disponibles</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>
    </main>
  )
}

export default GestionCursos