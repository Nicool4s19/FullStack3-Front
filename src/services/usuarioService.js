import { createServiceClient } from "../api/http"
import { requireServiceUrl } from "../api/serviceUrls"

const api = createServiceClient(requireServiceUrl("auth"))

export function listarUsuarios() {
  return api.get("/api/usuarios")
}

export function crearUsuario(usuario) {
  return api.post("/api/usuarios", usuario)
}

export function actualizarUsuario(id, usuario) {
  return api.put(`/api/usuarios/${id}`, usuario)
}

export function eliminarUsuario(id) {
  return api.delete(`/api/usuarios/${id}`)
}

export function listarRoles() {
  return api.get("/api/roles")
}