export const roles = {
  ADMIN: "Administrador",
  DOCENTE: "Docente",
  APODERADO: "Apoderado",
  ESTUDIANTE: "Estudiante",
  USER: "Usuario"
}


export const permisos = {

  ADMIN: [
    "Gestión de usuarios",
    "Cursos",
    "Asignaturas",
    "Mensajería",
    "Calendario",
    "Anotaciones"
  ],


  DOCENTE: [
    "Cursos",
    "Asignaturas",
    "Anotaciones",
    "Calendario"
  ],


  APODERADO: [
    "Ficha alumno",
    "Calendario",
    "Mensajería"
  ],


  ESTUDIANTE: [
    "Cursos",
    "Calendario",
    "Mensajería"
  ],


  USER: [
    "Cursos",
    "Mensajería"
  ]

}