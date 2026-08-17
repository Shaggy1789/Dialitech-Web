# JWT Storage & Migration Plan

## Estado actual

El JWT se obtiene en el login como `Authorization: Bearer <token>` (devuelto en
el body de la respuesta). El backend actual **NO** emite cookies (`Set-Cookie`)
ni soporta `withCredentials`:

- `src/services/api.js` usa `withCredentials: false` y envía el token en el
  header `Authorization`.
- El token se guarda en **`sessionStorage`** (ver `src/config/security.js`,
  `AUTH_CONFIG.TOKEN_STORAGE = 'sessionStorage'`).

### Por qué `sessionStorage` (y no `localStorage`)

- El token **no persiste** al cerrar el navegador (reduce la ventana de robo).
- Sobrevive al refresh dentro de la misma pestaña (la sesión continúa).
- Tradeoff conocido: la sesión **no se comparte** entre pestañas/ventanas nuevas.

### Riesgo del almacenamiento actual

Cualquier vulnerabilidad XSS permite leer `sessionStorage` (accesible por JS).
La mitigación correcta es mover el token a una **cookie HttpOnly**, inaccesible
desde JavaScript.

## Estado verificado del backend (probes del 2026-08-17)

Sonda contra `https://api-dialitech-core-v2.onrender.com`:

| Probe | Resultado | Implicación |
|---|---|---|
| `GET /api/v1/auth/me` (sin token) | `401` + `www-authenticate: Bearer` | valida JWT por header |
| `OPTIONS /api/v1/auth/login` (preflight) | `204` **sin** `Access-Control-Allow-Origin/Credentials` | **CORS no habilitado**; llamadas cross-origin con cookies hoy imposibles |
| `POST /api/v1/auth/login` (credenciales inválidas) | `401` "Invalid email or password", **sin `Set-Cookie`** | no emite cookies |
| `POST /api/v1/auth/logout`, `POST /api/v1/auth/refresh` | no existen en el cliente (`auth.service.js`) | logout es solo cliente; no hay refresh/revocación |

**Conclusión: el backend NO es compatible con HttpOnly cookie en este momento.**
No se cambia el frontend hasta que el backend soporte cookies.

## Migración a cookie HttpOnly (requiere backend)

Esta migración **NO se implementa en el frontend hasta que el backend la
soporte**. Debe hacerse de forma coordinada y **por etapas** (soporte dual) para
no romper el login actual. La ruta es:

### Etapa 0 — Preparación (backend)

- Habilitar CORS con credenciales SOLO para el origen de Netlify
  (`https://dialitech-web.netlify.app`): `Access-Control-Allow-Origin` + `Access-Control-Allow-Credentials: true`
  + `Access-Control-Allow-Headers: Content-Type, X-CSRF-Token`.
  (Actualmente el frontend pasa por el proxy same-origin de Netlify; al mover el
  login a cookie, si se sigue usando el proxy no se necesita CORS — evaluar
  mantener el proxy para no depender de CORS.)
- Añadir `POST /auth/logout` que invalide la cookie/refresh token.
- Añadir rotación de refresh tokens (`POST /auth/refresh`) y revocación.

### Etapa 1 — Backend (cambios en el servidor)

- Emitir el token en una cookie:
  `Set-Cookie: access_token=<jwt>; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=<T>`
  (`SameSite=Strict` porque la app es same-origin; sin iframes cross-site).
- Aceptar **ambos**: cookie **y** `Authorization: Bearer` (soporte dual) durante
  la transición para no romper sesiones activas.
- Validar el JWT de la cookie en el middleware (misma lógica que el header).
- Protección CSRF: con `SameSite=Strict` el navegador bloquea la mayoría de
  CSRF; para endpoints mutantes, emitir `X-CSRF-Token` y validarlo server-side.
- Expiración corta del access token + refresh token rotativo para revocación.

### Etapa 2 — Frontend (solo cuando la Etapa 1 esté en producción)

1. `src/services/api.js`: `withCredentials: true`.
2. Eliminar el almacenamiento del token (NO localStorage, NO sessionStorage tras la migración):
   - `token.service.js`: `setToken`/`getToken` pasan a no-usar `sessionStorage`.
   - El interceptor de request deja de inyectar `Authorization` (la cookie viaja sola).
3. Eliminar `sessionStorage` del usuario/estado sensible (`authStore`).
4. `logout`: llamar a `POST /auth/logout` para invalidar la cookie (no basta borrar en cliente).
5. Manejador global de `401` (`authEvents` + `clearAuthStorage`) sigue funcionando;
   en la migración el navegador no reenvía la cookie si caduca (→ redirigir a login).
6. Si se mantiene el proxy same-origin de Netlify, no hace falta CORS en el navegador;
   si se llama al backend directo, configurar `Access-Control-Allow-Credentials`.

### Consideraciones de migración

- Mantener **ambos** modos (cookie + Bearer) durante el despliegue para no romper
  sesiones activas.
- Probar en la rama de producción antes de cortar el Bearer.
- Registrar un indicador de versión para forzar re-login tras el cambio.
- NO hacer la Etapa 2 antes que la Etapa 1 (rompería el login actual).

## Documentos relacionados

- `docs/RATE_LIMITING.md`: mitigación de fuerza bruta en `/auth/login`, `/auth/register` y recovery.
- `docs/BRANCH_PROTECTION.md`: protección de la rama `main`.
- `src/config/security.js`: política de contraseñas y configuración de sesión.