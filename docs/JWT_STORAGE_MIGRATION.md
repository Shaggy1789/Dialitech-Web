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

## Migración a cookie HttpOnly (requiere backend)

Esta migración **NO se implementa en el frontend hasta que el backend la
soporte**. La ruta es:

### 1. Backend

- Emitir el token en una cookie: `Set-Cookie: token=<jwt>; HttpOnly; Secure; SameSite=Strict; Path=/`.
- Mantener `Authorization` opcional durante la transición (soporte dual).
- Añadir rotación de refresh tokens y revocación en logout.
- Protección CSRF:
  - Con `SameSite=Strict` la mayoría de ataques CSRF se bloquean por el navegador.
  - Para endpoints mutantes, usar un header custom `X-CSRF-Token` validado por el servidor.
- Preferir `SameSite=Strict` para esta app (misma-origin; sin iframes cross-site).

### 2. Frontend (solo cuando el backend esté listo)

1. Configurar axios: `withCredentials: true`.
2. Eliminar el guardado del token:
   - `token.service.js`: `setToken`/`getToken` pasan a no-usar `sessionStorage`.
   - El interceptor de request deja de inyectar `Authorization` (la cookie viaja sola).
3. Eliminar `sessionStorage` del usuario/estado sensible.
4. En `logout`, llamar al backend para invalidar la cookie (no basta borrar en cliente).
5. Manejador global de `401` ya existente (`authEvents` + `clearAuthStorage`) sigue
   funcionando; en estado de migración el navegador no reenvía la cookie si caduca.

### Consideraciones de migración

- Mantener **ambos** modos (cookie + Bearer) durante el despliegue para no romper
  sesiones activas.
- Probar en la rama de producción antes de cortar el Bearer.
- Registrar un indicador de versión para forzar re-login tras el cambio.

## Documentos relacionados

- `docs/RATE_LIMITING.md`: mitigación de fuerza bruta en `/auth/login`, `/auth/register` y recovery.
- `docs/BRANCH_PROTECTION.md`: protección de la rama `main`.
- `src/config/security.js`: política de contraseñas y configuración de sesión.