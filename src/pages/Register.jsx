import { roles } from "../auth/roles"

function Register({ onRegister, goToLogin }) {

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    const user = {
      nombre: formData.get("nombre"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
    }

    onRegister(user)
  }

  return (
    <section className="auth-card">

      <span className="badge">EduGestión</span>

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
          <option value="">Selecciona un rol</option>

          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}

        </select>

        <button type="submit">
          Registrarme
        </button>

      </form>

      <button
        className="link-button"
        onClick={goToLogin}
      >
        ¿Ya tienes una cuenta? Inicia sesión
      </button>

    </section>
  )
}

export default Register