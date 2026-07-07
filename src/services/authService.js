import { createServiceClient } from "../api/http"
import { clearSession, getSession, saveSession } from "../api/session"
import { requireServiceUrl } from "../api/serviceUrls"

let authClient

function getAuthClient() {
  if (!authClient) {
    authClient = createServiceClient(requireServiceUrl("auth"))
  }

  return authClient
}

function normalizeSession(data, fallbackUser = {}) {
  const token = data?.token || data?.accessToken || data?.jwt
  const user = data?.user || data?.usuario || data?.data?.user || data

  return {
    token,
    user: {
      nombre: user?.nombre || user?.name || fallbackUser.nombre,
      email: user?.email || fallbackUser.email,
      role: user?.role || user?.rol || fallbackUser.role,
      id: user?.id || user?._id,
    },
  }
}

export async function login(credentials) {

  const { data } = await getAuthClient().post(
    "/api/usuarios/login",
    credentials
  );

  const session = {
    token: data.token,
    user: {
      email: credentials.email,
      role: data.rol
    }
  };

  saveSession(session);

  return session.user;
}

export async function register(payload) {
  const { data } = await getAuthClient().post("/api/usuarios", payload)

  const session = normalizeSession(data, payload)

  saveSession(session)
  return session.user
}

export async function getCurrentUser() {

  const session = getSession();

  if (!session) {
    return null;
  }

  return session.user;
}


export function logout() {
  clearSession()
}
