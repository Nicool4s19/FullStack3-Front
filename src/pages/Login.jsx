import { roles } from "../auth/roles"

function Login({ onLogin, goToRegister }) {
  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    const user = {
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
    }

    onLogin(user)
  }

  return (
    <section className="auth-card">
      <span className="badge">EduGestión</span>

      <h1>Iniciar sesión</h1>
      <p>Ingresa con tu correo y rol para acceder al sistema.</p>

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

        <select name="role" required>
          <option value="">Selecciona tu rol</option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        <button type="submit">Entrar</button>
      </form>

      <button className="link-button" onClick={goToRegister}>
        ¿No tienes cuenta? Regístrate
      </button>
    </section>
  )
}

export default Login