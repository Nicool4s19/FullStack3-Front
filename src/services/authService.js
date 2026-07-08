import { createServiceClient } from "../api/http"
import { clearSession, getSession, saveSession } from "../api/session"
import { requireServiceUrl } from "../api/serviceUrls"


let authClient


function getAuthClient(){

  if(!authClient){

    authClient = createServiceClient(
      requireServiceUrl("auth")
    )

  }

  return authClient
}



export async function login(credentials){

  const {data} = await getAuthClient()
    .post(
      "/api/usuarios/login",
      credentials
    )

  const session = {
    token: data.token,
    user: {
      nombre: credentials.email,
      email: credentials.email,
      role: data.rol || "USER"
    }
  }

  saveSession(session)

  return session.user
}



export async function register(payload){

  const {data} = await getAuthClient()
    .post(
      "/api/usuarios",
      payload
    )


  return {

    nombre:data.nombre,
    email:data.email,
    role:data.rol?.nombreRol || "USER"

  }

}



export async function getCurrentUser(){

  const session=getSession()


  if(!session?.token){

    return null

  }


  return session.user

}



export function logout(){

  clearSession()

}