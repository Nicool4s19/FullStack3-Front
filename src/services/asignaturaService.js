import { createServiceClient } from "../api/http"
import { requireServiceUrl } from "../api/serviceUrls"

const api = createServiceClient(requireServiceUrl("subjects"))

export function listarAsignaturas() {
  return api.get("/api/asignaturas")
}

export function buscarAsignaturaPorId(id) {
  return api.get(`/api/asignaturas/${id}`)
}

export function crearAsignatura(asignatura) {
  return api.post("/api/asignaturas", asignatura)
}

export function eliminarAsignatura(id) {
  return api.delete(`/api/asignaturas/${id}`)
}

export function listarAnotaciones() {
  return api.get("/api/anotaciones")
}

export function crearAnotacion(anotacion) {
  return api.post("/api/anotaciones", anotacion)
}

export function eliminarAnotacion(id) {
  return api.delete(`/api/anotaciones/${id}`)
}