export const roles = [
  "Administrador",
  "Docente",
  "Apoderado",
  "Estudiante"
]

export const permisos = {
  Administrador: [
    "Gestion de usuarios",
    "Cursos",
    "Ficha alumno",
    "Mensajeria",
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
    "Mensajeria"
  ],

  Estudiante: [
    "Cursos",
    "Calendario"
  ]
}
