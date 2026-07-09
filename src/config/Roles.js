export const ROLES = {
  ADMIN: "ADMIN",
  PROFESOR: "PROFESOR",
  ALUMNO: "ALUMNO",
  APODERADO: "APODERADO",
  INSPECTOR: "INSPECTOR",
  ADMINISTRATIVO: "ADMINISTRATIVO",
  USER: "USER",
}

export function normalizeRole(role) {
  const roleValue =
    typeof role === "string"
      ? role
      : role?.nombreRol || role?.name || role?.rol || ""

  const normalized = roleValue
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_")
    .replace(/^ROLE_/, "")

  const aliases = {
    ADMIN: ROLES.ADMIN,
    ADMINISTRADOR: ROLES.ADMIN,

    PROFESOR: ROLES.PROFESOR,
    DOCENTE: ROLES.PROFESOR,

    ALUMNO: ROLES.ALUMNO,
    ESTUDIANTE: ROLES.ALUMNO,

    APODERADO: ROLES.APODERADO,

    INSPECTOR: ROLES.INSPECTOR,

    ADMINISTRATIVO: ROLES.ADMINISTRATIVO,

    USER: ROLES.USER,
    USUARIO: ROLES.USER,
  }

  return aliases[normalized] || normalized
}

export const modules = [
  {
    nombre: "Gestión de usuarios",
    descripcion: "Administrar usuarios y roles del sistema.",
    ruta: "/admin/usuarios",
    roles: [ROLES.ADMIN],
  },
  {
    nombre: "Cursos",
    descripcion: "Consultar cursos registrados.",
    ruta: "/admin/cursos",
    roles: [
      ROLES.ADMIN,
      ROLES.PROFESOR,
      ROLES.ALUMNO,
      ROLES.INSPECTOR,
      ROLES.ADMINISTRATIVO,
    ],
  },
  {
    nombre: "Asignaturas",
    descripcion: "Consultar asignaturas.",
    ruta: "/admin/asignaturas",
    roles: [
      ROLES.ADMIN,
      ROLES.PROFESOR,
      ROLES.ALUMNO,
      ROLES.ADMINISTRATIVO,
    ],
  },
  {
    nombre: "Anotaciones",
    descripcion: "Consultar y registrar anotaciones.",
    ruta: "/admin/anotaciones",
    roles: [
      ROLES.ADMIN,
      ROLES.PROFESOR,
      ROLES.INSPECTOR,
    ],
  },
  {
    nombre: "Calendario",
    descripcion: "Consultar actividades y eventos.",
    ruta: "/admin/calendario",
    roles: [
      ROLES.ADMIN,
      ROLES.PROFESOR,
      ROLES.ALUMNO,
      ROLES.APODERADO,
      ROLES.INSPECTOR,
      ROLES.ADMINISTRATIVO,
    ],
  },
  {
    nombre: "Mensajes",
    descripcion: "Consultar mensajes.",
    ruta: "/admin/mensajes",
    roles: [
      ROLES.ADMIN,
      ROLES.PROFESOR,
      ROLES.ALUMNO,
      ROLES.APODERADO,
      ROLES.INSPECTOR,
      ROLES.ADMINISTRATIVO,
    ],
  },
  {
    nombre: "Reuniones",
    descripcion: "Consultar reuniones y citaciones.",
    ruta: "/admin/reuniones",
    roles: [
      ROLES.ADMIN,
      ROLES.APODERADO,
      ROLES.ADMINISTRATIVO,
    ],
  },
  {
    nombre: "Portal Informativo",
    descripcion: "Consultar mural y calendario estudiantil.",
    ruta: "/admin/portal",
    roles: [
      ROLES.ADMIN,
      ROLES.ALUMNO,
      ROLES.APODERADO,
      ROLES.ADMINISTRATIVO,
    ],
  },
  {
    nombre: "Ficha del alumno",
    descripcion: "Consultar información del estudiante.",
    ruta: "/ficha-alumno",
    roles: [
      ROLES.ADMIN,
      ROLES.APODERADO,
    ],
  },
]

export function getModulesByRole(role) {
  const normalizedRole = normalizeRole(role)

  return modules.filter((module) =>
    module.roles.includes(normalizedRole)
  )
}

export function canAccess(role, allowedRoles = []) {
  const normalizedRole = normalizeRole(role)

  return allowedRoles.includes(normalizedRole)
}