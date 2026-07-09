import { Link } from "react-router-dom"
import { getRoleLabel } from "../auth/roles"

function AccesoDenegado({ user }) {
  return (
    <main className="admin-page">
      <section className="admin-table-card access-denied-card">
        <span className="page-tag">ACCESO RESTRINGIDO</span>

        <h1>🚫 No tienes permiso para ver esta vista</h1>

        <p>
          Tu rol actual es <strong>{getRoleLabel(user?.role)}</strong>. Por seguridad,
          solo puedes ingresar a los módulos habilitados para tu perfil.
        </p>

        <Link className="back-button access-back-button" to="/">
          ⬅ Volver al dashboard
        </Link>
      </section>
    </main>
  )
}

export default AccesoDenegado