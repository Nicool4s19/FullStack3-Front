import { permisos } from "../auth/roles"
import {Link} from "react-router-dom"

function AdminDashboard({user,onLogout}) {


const modulos = permisos.ADMIN


return (

<main className="dashboard">


<aside className="sidebar">


<h2>
🎓 EduGestion Admin
</h2>


<div className="user-box">

<strong>
{user.nombre || user.email}
</strong>

<span>
Administrador
</span>

</div>


<nav>

{modulos.map((modulo)=>(

<Link
to={
modulo==="Gestión de usuarios"
? "/admin/usuarios"
: "#"
}
>
{modulo}
</Link>

))}

</nav>


<button
className="logout"
onClick={onLogout}
>
Cerrar Sesión
</button>


</aside>



<section className="content">


<header className="topbar">

<div>

<h1>
Panel Administrador
</h1>


<p>
Control total del sistema
</p>


</div>


<button className="admin-button">

➕ Crear usuario

</button>


</header>




<section className="cards-grid">


{modulos.map((modulo)=>(


<article
className="module-card"
key={modulo}
>


<h3>
{modulo}
</h3>


<p>
Administración del módulo
</p>


<button>
Ingresar
</button>


</article>


))}


</section>


</section>


</main>


)

}


export default AdminDashboard