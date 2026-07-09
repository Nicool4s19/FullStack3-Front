import {
  Users,
  BookOpen,
  GraduationCap,
  MessageSquare,
  CalendarDays,
  ClipboardList,
  Building2,
  Bell,
  User,
} from "lucide-react"

export const ROLE = {
  ADMIN: "ADMIN",
  DOCENTE: "DOCENTE",
  APODERADO: "APODERADO",
  ESTUDIANTE: "ESTUDIANTE",
  INSPECTOR: "INSPECTOR",
  ADMINISTRATIVO: "ADMINISTRATIVO",
  USER: "USER",
}

const quitarAcentos = (texto) =>
  String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")

const roleAliases = {
  ADMIN: ROLE.ADMIN,
  ADMINISTRADOR: ROLE.ADMIN,
  "ADMINISTRADOR GENERAL": ROLE.ADMIN,

  DOCENTE: ROLE.DOCENTE,
  PROFESOR: ROLE.DOCENTE,

  APODERADO: ROLE.APODERADO,
  TUTOR: ROLE.APODERADO,

  ESTUDIANTE: ROLE.ESTUDIANTE,
  ALUMNO: ROLE.ESTUDIANTE,

  INSPECTOR: ROLE.INSPECTOR,

  ADMINISTRATIVO: ROLE.ADMINISTRATIVO,
  SECRETARIA: ROLE.ADMINISTRATIVO,
  SECRETARIO: ROLE.ADMINISTRATIVO,

  USER: ROLE.USER,
  USUARIO: ROLE.USER,
}

export function normalizeRole(role) {
  const rawRole =
    typeof role === "object"
      ? role?.nombreRol || role?.rol || role?.role || role?.name
      : role

  const normalized = quitarAcentos(rawRole)
    .trim()
    .toUpperCase()

  return roleAliases[normalized] || ROLE.USER
}

export function getRoleLabel(role) {
  const normalized = normalizeRole(role)

  const labels = {
    [ROLE.ADMIN]: "Administrador",
    [ROLE.DOCENTE]: "Profesor",
    [ROLE.APODERADO]: "Apoderado",
    [ROLE.ESTUDIANTE]: "Alumno",
    [ROLE.INSPECTOR]: "Inspector",
    [ROLE.ADMINISTRATIVO]: "Administrativo",
    [ROLE.USER]: "Usuario",
  }

  return labels[normalized] || "Usuario"
}

export const modulos = {
  usuarios: {
    id: "usuarios",
    nombre: "Gestión de usuarios",
    descripcion: "Crear, editar y administrar usuarios del sistema.",
    ruta: "/admin/usuarios",
    icono: Users,
    resumen: "Usuarios",
  },

  cursos: {
    id: "cursos",
    nombre: "Cursos",
    descripcion: "Ver cursos del establecimiento.",
    ruta: "/admin/cursos",
    icono: BookOpen,
    resumen: "Cursos",
  },

  asignaturas: {
    id: "asignaturas",
    nombre: "Asignaturas",
    descripcion: "Consultar asignaturas.",
    ruta: "/admin/asignaturas",
    icono: GraduationCap,
    resumen: "Asignaturas",
  },

  mensajes: {
    id: "mensajes",
    nombre: "Mensajería",
    descripcion: "Comunicación interna entre usuarios.",
    ruta: "/admin/mensajes",
    icono: MessageSquare,
    resumen: "Mensajes",
  },

  anotaciones: {
    id: "anotaciones",
    nombre: "Anotaciones",
    descripcion: "Registro de observaciones escolares.",
    ruta: "/admin/anotaciones",
    icono: ClipboardList,
    resumen: "Anotaciones",
  },

  calendario: {
    id: "calendario",
    nombre: "Calendario",
    descripcion: "Eventos y actividades importantes.",
    ruta: "/admin/calendario",
    icono: CalendarDays,
    resumen: "Eventos",
  },

  reuniones: {
    id: "reuniones",
    nombre: "Reuniones",
    descripcion: "Ver y gestionar reuniones escolares.",
    ruta: "/admin/reuniones",
    icono: Building2,
    resumen: "Reuniones",
  },

  portal: {
    id: "portal",
    nombre: "Portal Informativo",
    descripcion: "Mural digital e información institucional.",
    ruta: "/admin/portal",
    icono: Bell,
    resumen: "Avisos",
  },

  fichaAlumno: {
    id: "fichaAlumno",
    nombre: "Ficha alumno",
    descripcion: "Información académica del alumno.",
    ruta: "/mi-ficha",
    icono: User,
    resumen: "Ficha",
  },
}

const modulosPorRol = {
  [ROLE.ADMIN]: [
    "usuarios",
    "cursos",
    "asignaturas",
    "mensajes",
    "anotaciones",
    "calendario",
    "reuniones",
    "portal",
  ],

  [ROLE.ADMINISTRATIVO]: [
    "cursos",
    "asignaturas",
    "mensajes",
    "calendario",
    "reuniones",
    "portal",
  ],

  [ROLE.DOCENTE]: [
    "cursos",
    "asignaturas",
    "anotaciones",
    "calendario",
    "mensajes",
    "reuniones",
  ],

  [ROLE.INSPECTOR]: [
    "cursos",
    "anotaciones",
    "calendario",
    "mensajes",
  ],

  [ROLE.APODERADO]: [
    "fichaAlumno",
    "calendario",
    "mensajes",
    "reuniones",
    "portal",
  ],

  [ROLE.ESTUDIANTE]: [
    "cursos",
    "asignaturas",
    "calendario",
    "mensajes",
    "portal",
  ],

  [ROLE.USER]: [
    "calendario",
    "mensajes",
    "portal",
  ],
}

export function getModuleIdsForRole(role) {
  return modulosPorRol[normalizeRole(role)] || modulosPorRol[ROLE.USER]
}

export function getModulesForRole(role) {
  return getModuleIdsForRole(role)
    .map((moduleId) => modulos[moduleId])
    .filter(Boolean)
}

export function canAccessModule(role, moduleId) {
  return getModuleIdsForRole(role).includes(moduleId)
}

export function canAccessPath(role, path) {
  if (path === "/") return true

  const moduleFound = Object.values(modulos).find(
    (modulo) => modulo.ruta === path
  )

  if (!moduleFound) return false

  return canAccessModule(role, moduleFound.id)
}

export function canCreateUsers(role) {
  return normalizeRole(role) === ROLE.ADMIN
}

export function canManageAcademicData(role) {
  return [ROLE.ADMIN, ROLE.ADMINISTRATIVO].includes(normalizeRole(role))
}

export function canManageAnnotations(role) {
  return [ROLE.ADMIN, ROLE.DOCENTE, ROLE.INSPECTOR].includes(normalizeRole(role))
}

export function canManageCalendar(role) {
  return [ROLE.ADMIN, ROLE.ADMINISTRATIVO, ROLE.INSPECTOR].includes(
    normalizeRole(role)
  )
}

export function canDeleteRecords(role) {
  return [ROLE.ADMIN, ROLE.ADMINISTRATIVO].includes(normalizeRole(role))
}

export function canDeleteMessages(role) {
  return normalizeRole(role) === ROLE.ADMIN
}

export const roles = [
  "Administrador",
  "Profesor",
  "Alumno",
  "Apoderado",
  "Inspector",
  "Administrativo",
]