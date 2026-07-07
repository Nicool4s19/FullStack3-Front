import { useState } from "react"
import { getApiErrorMessage } from "../api/http"
import { login } from "../services/authService"

function Login({ onLogin, goToRegister }) {
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
      <span className="badge">EduGestion</span>

      <h1>Iniciar sesion</h1>
      <p>Ingresa con tu correo y rol para acceder al sistema.</p>

      <form onSubmit={handleSubmit}>
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


        {error && <p className="form-error">{error}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Conectando..." : "Entrar"}
        </button>
      </form>

      <button className="link-button" onClick={goToRegister}>
        Crear usuario
      </button>
    </section>
  )
}

export default Login
