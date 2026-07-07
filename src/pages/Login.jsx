import { useState } from "react"
import { getApiErrorMessage } from "../api/http"
import { login } from "../services/authService"

function Login({ onLogin }) {
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)

    const credentials = {
      email: formData.get("email"),
      password: formData.get("password"),
    }

    try {
      const user = await login(credentials)
      onLogin(user)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-card">
      <span className="badge">🎓 EduGestion</span>

      <h1>Iniciar Sesión</h1>

      <p>
        Plataforma de gestión escolar para estudiantes,
        docentes y administradores.
      </p>

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Correo electrónico"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          required
        />

        {error && (
          <p className="form-error">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Conectando..."
            : "Ingresar"}
        </button>
      </form>
    </section>
  )
}

export default Login