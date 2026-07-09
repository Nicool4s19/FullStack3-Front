import { createServiceClient } from "../api/http"
import { requireServiceUrl } from "../api/serviceUrls"

const api = createServiceClient(requireServiceUrl("messages"))

export function listarMensajes() {
  return api.get("/api/mensajes")
}

export function buscarMensajePorId(id) {
  return api.get(`/api/mensajes/${id}`)
}

export function crearMensaje(mensaje) {
  return api.post("/api/mensajes", mensaje)
}

export function listarMensajesPorRemitente(idRemitente) {
  return api.get(`/api/mensajes/remitente/${idRemitente}`)
}

export function listarMensajesPorDestinatario(idDestinatario) {
  return api.get(`/api/mensajes/destinatario/${idDestinatario}`)
}

export function listarMensajesNoLeidos(idDestinatario) {
  return api.get(`/api/mensajes/destinatario/${idDestinatario}/no-leidos`)
}

export function marcarMensajeComoLeido(id) {
  return api.put(`/api/mensajes/${id}/leido`)
}

export function eliminarMensaje(id) {
  return api.delete(`/api/mensajes/${id}`)
}