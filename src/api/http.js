import axios from "axios"
import { clearSession, getAccessToken } from "./session"

export function createServiceClient(baseURL) {
  const client = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
    },
  })

  client.interceptors.request.use((config) => {
    const token = getAccessToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        clearSession()
      }

      return Promise.reject(error)
    }
  )

  return client
}

export function getApiErrorMessage(error) {
  const message =
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message

  return message || "No se pudo conectar con el servicio."
}
