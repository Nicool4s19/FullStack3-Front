import { createServiceClient } from "../api/http"
import { requireServiceUrl } from "../api/serviceUrls"

const api = createServiceClient(requireServiceUrl("courses"))

export function listarCursos() {
  return api.get("/api/v1/cursos")
}

export function crearCurso(curso) {
  return api.post("/api/v1/cursos", curso)
}

export function actualizarCurso(id, curso) {
  return api.put(`/api/v1/cursos/${id}`, curso)
}

export function eliminarCurso(id) {
  return api.delete(`/api/v1/cursos/${id}`)
}

export function listarNiveles() {
  return api.get("/api/v1/niveles")
}

export function crearNivel(nivel) {
  return api.post("/api/v1/niveles", nivel)
}

export function actualizarNivel(id, nivel) {
  return api.put(`/api/v1/niveles/${id}`, nivel)
}

export function eliminarNivel(id) {
  return api.delete(`/api/v1/niveles/${id}`)
}