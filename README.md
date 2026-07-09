# EduGestion - Frontend

EduGestion es una plataforma web de gestión escolar desarrollada con React.  
El sistema permite administrar y visualizar información de un establecimiento educacional según el rol del usuario que inicia sesión.

La página está pensada para distintos tipos de usuarios, como administrador, profesor, alumno, apoderado, inspector y administrativo. Cada rol tiene acceso solo a las vistas y funciones que le corresponden.

---

## Tecnologías utilizadas

- React
- Vite
- React Router DOM
- Axios
- Lucide React
- CSS personalizado

---

## Objetivo del proyecto

El objetivo principal del proyecto es entregar una plataforma escolar donde los usuarios puedan acceder a distintos módulos dependiendo de su rol.

Por ejemplo:

- Un administrador puede gestionar usuarios, cursos, asignaturas, mensajes, anotaciones, calendario, reuniones y portal informativo.
- Un alumno puede ver cursos, asignaturas, calendario, mensajes y portal informativo.
- Un profesor puede revisar cursos, asignaturas, anotaciones, calendario, mensajes y reuniones.
- Un apoderado puede revisar información asociada al alumno, calendario, mensajes, reuniones y portal informativo.
- Un inspector puede revisar cursos, anotaciones, calendario y mensajes.
- Un administrativo puede gestionar información académica, calendario, reuniones, mensajes y portal.

---

## Funcionalidades principales

### 1. Inicio de sesión

La aplicación cuenta con una vista de login donde el usuario debe ingresar su correo electrónico y contraseña.

Al iniciar sesión correctamente, el sistema guarda la sesión del usuario en el navegador y lo redirige al dashboard correspondiente.

El login se conecta con el servicio de usuarios mediante la variable de entorno:

```env
VITE_USUARIO_API_URL