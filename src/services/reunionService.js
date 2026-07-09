import { createServiceClient } from "../api/http"
import { requireServiceUrl } from "../api/serviceUrls"

const api = createServiceClient(requireServiceUrl("meetings"))

export function listarReuniones() {
  return api.get("/api/reuniones")
}

export function crearReunion(reunion) {
  return api.post("/api/reuniones", reunion)
}

export function actualizarReunion(id, reunion) {
  return api.put(`/api/reuniones/${id}`, reunion)
}

export function eliminarReunion(id) {
  return api.delete(`/api/reuniones/${id}`)
}

export function listarCitaciones() {
  return api.get("/api/citaciones")
}

export function crearCitacion(citacion) {
  return api.post("/api/citaciones", citacion)
}

export function actualizarCitacion(id, citacion) {
  return api.put(`/api/citaciones/${id}`, citacion)
}

export function eliminarCitacion(id) {
  return api.delete(`/api/citaciones/${id}`)
}

export function listarBitacorasGenerales() {
  return api.get("/api/bitacora-general")
}

export function crearBitacoraGeneral(bitacora) {
  return api.post("/api/bitacora-general", bitacora)
}

export function actualizarBitacoraGeneral(id, bitacora) {
  return api.put(`/api/bitacora-general/${id}`, bitacora)
}

export function eliminarBitacoraGeneral(id) {
  return api.delete(`/api/bitacora-general/${id}`)
}