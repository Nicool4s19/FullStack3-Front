import { createServiceClient } from "../api/http"
import { requireServiceUrl } from "../api/serviceUrls"

const api = createServiceClient(requireServiceUrl("portal"))

export function listarMural() {
  return api.get("/api/portal/mural")
}

export function crearMural(publicacion) {
  return api.post("/api/portal/mural", publicacion)
}

export function listarCalendarioPortal() {
  return api.get("/api/portal/calendario")
}

export function crearEventoPortal(evento) {
  return api.post("/api/portal/calendario", evento)
}