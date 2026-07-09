import { createServiceClient } from "../api/http"
import { clearSession, getSession, saveSession } from "../api/session"
import { requireServiceUrl } from "../api/serviceUrls"
import { normalizeRole } from "../auth/roles"

let authClient

function getAuthClient() {
  if (!authClient) {
    authClient = createServiceClient(requireServiceUrl("auth"))
  }

  return authClient
}

function obtenerRolDesdeRespuesta(data) {
  return normalizeRole(
    data?.usuario?.rol?.nombreRol ||
    data?.usuario?.rol ||
    data?.user?.rol?.nombreRol ||
    data?.user?.rol ||
    data?.rol?.nombreRol ||
    data?.rol ||
    data?.role ||
    "USER"
  )
}

function obtenerUsuarioDesdeRespuesta(data, credentials = {}) {
  const usuario = data?.usuario || data?.user || data

  return {
    idUsuario: usuario?.idUsuario || usuario?.id || null,
    nombre: usuario?.nombre || credentials.email,
    email: usuario?.email || credentials.email,
    role: obtenerRolDesdeRespuesta(data),
  }
}

export async function login(credentials) {
  const { data } = await getAuthClient().post(
    "/api/usuarios/login",
    credentials
  )

  const session = {
    token: data.token,
    user: obtenerUsuarioDesdeRespuesta(data, credentials),
  }

  saveSession(session)

  return session.user
}

export async function register(payload) {
  const { data } = await getAuthClient().post(
    "/api/usuarios",
    payload
  )

  return obtenerUsuarioDesdeRespuesta(data)
}

export async function getCurrentUser() {
  const session = getSession()

  if (!session?.token) {
    return null
  }

  return {
    ...session.user,
    role: normalizeRole(session.user?.role),
  }
}

export function logout() {
  clearSession()
}