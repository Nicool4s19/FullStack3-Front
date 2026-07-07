# EduGestion Frontend

Frontend React/Vite preparado para conectarse a microservicios publicados en AWS.

## Configuracion de microservicios AWS

1. Copia `.env.example` como `.env`.
2. Reemplaza cada URL por el endpoint publico de tus servicios en AWS.
3. Reinicia `npm run dev` despues de cambiar variables `VITE_*`.

```bash
VITE_AUTH_API_URL=https://api.tu-dominio.com
VITE_USERS_API_URL=https://users.tu-dominio.com
VITE_COURSES_API_URL=https://courses.tu-dominio.com
```

El login usa estos endpoints por defecto:

- `POST /auth/login`
- `POST /auth/register`
- `GET /auth/me`

Si tu backend usa rutas distintas, ajustalas en `src/services/authService.js`.

La guia completa de CORS, headers y formato de respuesta esta en `docs/aws-microservices.md`.

## Scripts

```bash
npm run dev
npm run build
npm run preview
```
