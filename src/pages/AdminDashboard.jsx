import { Link } from "react-router-dom";
import {
  Users, BookOpen, GraduationCap, MessageSquare,
  CalendarDays, ClipboardList, Building2,
  UserPlus, Bell, Search, LogOut, Home
} from "lucide-react";

const modulosAdmin = [
 {nombre:"Gestión de usuarios",descripcion:"Crear, editar y administrar usuarios.",ruta:"/admin/usuarios",icono:Users},
 {nombre:"Cursos",descripcion:"Administrar cursos.",ruta:"/admin/cursos",icono:BookOpen},
 {nombre:"Asignaturas",descripcion:"Administrar asignaturas.",ruta:"/admin/asignaturas",icono:GraduationCap},
 {nombre:"Mensajería",descripcion:"Comunicación interna.",ruta:"/admin/mensajes",icono:MessageSquare},
 {nombre:"Anotaciones",descripcion:"Bitácoras y observaciones.",ruta:"/admin/anotaciones",icono:ClipboardList},
 {nombre:"Calendario",descripcion:"Eventos y actividades.",ruta:"/admin/calendario",icono:CalendarDays},
 {nombre:"Reuniones",descripcion:"Gestionar reuniones.",ruta:"/admin/reuniones",icono:Building2},
 {nombre:"Portal Informativo",descripcion:"Mural digital.",ruta:"/admin/portal",icono:Bell},
];

export default function AdminDashboard({user,onLogout}){
return(
<main className="dashboard">
<aside className="sidebar">
<div className="logo-box"><Home size={34}/><div><h2>EduGestion</h2><span>Sistema Escolar</span></div></div>
<div className="user-box">

    <div className="avatar-circle">
        {(user.nombre || user.email).charAt(0).toUpperCase()}
    </div>

    <div className="user-info">

        <h3>{user.nombre || user.email}</h3>

        <p>Administrador General</p>

    </div>

</div>
<nav>{modulosAdmin.map(m=>{const I=m.icono;return <Link key={m.nombre} to={m.ruta}><I size={20}/>{m.nombre}</Link>})}</nav>
<button className="logout" onClick={onLogout}><LogOut size={18}/>Cerrar sesión</button>
</aside>
<section className="content">
<header className="dashboard-header">
<div><h1>Panel Administrativo</h1><p>Bienvenido <strong>{user.nombre||"Administrador"}</strong></p></div>
<div className="header-actions">
<div className="search-box"><Search size={18}/><input placeholder="Buscar..."/></div>
<Link className="admin-button" to="/admin/usuarios"><UserPlus size={18}/>Nuevo Usuario</Link>
</div>
</header>
<section className="stats-grid">
{[
["Usuarios","126",Users],["Cursos","18",BookOpen],["Asignaturas","42",GraduationCap],["Eventos","9",CalendarDays]
].map(([t,n,I])=><div className="stat-card" key={t}><I size={28}/><h3>{t}</h3><span>{n}</span></div>)}
</section>
<section className="cards-grid">
{modulosAdmin.map(m=>{const I=m.icono;return <article className="module-card" key={m.nombre}>
<div className="module-icon"><I size={28}/></div>
<h3>{m.nombre}</h3>
<p>{m.descripcion}</p>
<Link className="module-button" to={m.ruta}>Abrir módulo</Link>
</article>})}
</section>
</section>
</main>
)}