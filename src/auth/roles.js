export const roles = [
  "Administrador",
  "Docente",
  "Apoderado",
  "Estudiante"
]

export const permisos = {
  Administrador: [
    "Gestión de usuarios",
    "Cursos",
    "Ficha alumno",
    "Mensajería",
    "Calendario",
    "Anotaciones"
  ],

  Docente: [
    "Cursos",
    "Ficha alumno",
    "Anotaciones",
    "Calendario"
  ],

  Apoderado: [
    "Ficha alumno",
    "Calendario",
    "Mensajería"
  ],

  Estudiante: [
    "Cursos",
    "Calendario"
  ]
}