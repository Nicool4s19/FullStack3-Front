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

- `POST /api/usuarios/login`
- `POST /api/usuarios`

Si tu backend usa rutas distintas, ajustalas en `src/services/authService.js`.

Si publicas el frontend en HTTPS, las APIs tambien deben estar en HTTPS y permitir CORS para el dominio del frontend.

## Scripts

```bash
npm run dev
npm run build
npm run preview
```
