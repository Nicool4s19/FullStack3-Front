import { useState } from "react"
import { getApiErrorMessage } from "../api/http"
import { roles } from "../auth/roles"
import { register } from "../services/authService"

function Register({ goToLogin }) {
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const payload = {
  nombre: formData.get("nombre"),
  apellido: "Usuario",
  rut: Date.now().toString(),
  email: formData.get("email"),
  telefono: "999999999",
  password: formData.get("password"),
  idRol: 2,
  idDireccion: 1
}

    try {
  await register(payload)
  goToLogin()
} catch (requestError) { 
      setError(getApiErrorMessage(requestError))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-card">
      <span className="badge">EduGestion</span>

      <h1>Crear cuenta</h1>

      <p>Registra un nuevo usuario dentro del sistema.</p>

      <form onSubmit={handleSubmit}>
        <input
          name="nombre"
          placeholder="Nombre completo"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Correo electronico"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Contrasena"
          required
        />

        <select name="role" required>
          <option value="">Selecciona un rol</option>
           <option value="1">Administrador</option>
          <option value="2">Usuario</option>

          {roles.map((role) => (
            <option key={role} value={role}>

              {role}
            </option>
          ))}
        </select>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creando cuenta..." : "Registrarme"}
        </button>
      </form>

      <button
        className="link-button"
        onClick={goToLogin}
      >
        Ya tienes una cuenta? Inicia sesion
      </button>
    </section>
  )
}

export default Register
