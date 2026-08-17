# Rate Limiting — Dialitech-Web

## Estado actual

No existe rate limiting implementado. **No se implementa un rate limiter falso
en el frontend (Vue)**: un límite solo en el navegador no protege la API porque
puede eludirse con llamadas directas al servicio.

El rate limiting debe aplicarse **server-side**:

- **Backend principal** (`api-dialitech-core-v2.onrender.com`): la plataforma
  (Render) ofrece protección básica, pero la aplicación debe limitar los
  endpoints de autenticación (`/auth/login`, `/auth/register`, password
  recovery) para mitigar fuerza bruta.
- **ML proxy** (`netlify/functions/ml-proxy.js`): `POST /ml/api/v1/analyze`
  consume cómputo del servicio de IA y su clave es un recurso compartido.

## Mecanismo disponible en Netlify

Netlify ofrece **Rate Limiting** a nivel de edge (disponible según el plan).
Pasos:

1. Habilitar rate limiting en el sitio:
   `Site configuration → Edge → Rate limiting`.
2. Crear una regla para la ruta del proxy ML, por ejemplo:
   - `Path: /api/ml/*` (o `/.netlify/functions/ml-proxy/*`)
   - `Method: POST`
   - Límite: ej. 30 requests/minuto por IP (ajustar al uso real).
3. Opcionalmente, aplicar una regla similar a `/api/v1/auth/login` en el proxy
   del backend.

> No romper solicitudes legítimas: elegir límites holgados y monitorear antes
> de endurecer. El análisis IA legítimo hace 1 request por paciente/ventana.

## Recomendación a largo plazo

- Implementar rate limiting en el ML Service (FastAPI) con middleware
  (`slowapi` o similar) y/o en un API Gateway.
- Agregar *account lockout* / retraso exponencial en el backend para login.
- Si se despliega fuera de Netlify, usar el rate limiter del proveedor
  (Cloudflare / API Gateway).
