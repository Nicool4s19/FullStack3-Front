const stripTrailingSlash = (url) => url?.replace(/\/+$/, "")

export const serviceUrls = {
  // Servicio de usuarios (login, registro)
  auth: stripTrailingSlash(import.meta.env.VITE_USUARIO_API_URL),

  // Otros servicios
  courses: stripTrailingSlash(import.meta.env.VITE_CURSO_API),
  messages: stripTrailingSlash(import.meta.env.VITE_MENSAJERIA_API),
  subjects: stripTrailingSlash(import.meta.env.VITE_ASIGNATURA_API),
}

export function requireServiceUrl(serviceName) {
  const url = serviceUrls[serviceName]

  if (!url) {
    throw new Error(
      `Falta configurar la variable de entorno para ${serviceName}`
    )
  }

  return url
}