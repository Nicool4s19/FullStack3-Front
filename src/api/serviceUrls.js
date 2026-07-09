const stripTrailingSlash = (url) => url?.replace(/\/+$/, "")

export const serviceUrls = {
  auth: stripTrailingSlash(
    import.meta.env.VITE_USUARIO_API_URL
  ),

  courses: stripTrailingSlash(
    import.meta.env.VITE_CURSO_API
  ),

  messages: stripTrailingSlash(
    import.meta.env.VITE_MENSAJERIA_API
  ),

  subjects: stripTrailingSlash(
    import.meta.env.VITE_ASIGNATURA_API
  ),

  meetings: stripTrailingSlash(
    import.meta.env.VITE_REUNIONES_API
  ),
}

export function requireServiceUrl(serviceName) {
  const url = serviceUrls[serviceName]

  if (!url) {
    throw new Error(
      `Falta configurar ${serviceName}`
    )
  }

  return url
}