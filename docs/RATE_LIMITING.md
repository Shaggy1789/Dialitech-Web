# Rate Limiting — Dialitech-Web

## Endpoints reales (perspectiva del navegador → Netlify same-origin)

En producción el navegador **no** llama directamente al backend ni al ML service:
todo pasa por Netlify (mismo origen), así que el rate limiting se aplica en Netlify
**antes** de que llegue al backend/ML.

| Endpoint (navegador) | Backend destino | Motivo de protección |
|---|---|---|
| `POST /api/v1/auth/login` | Render (`/api/v1/auth/login`) | fuerza bruta |
| `POST /api/v1/auth/register` | Render (`/api/v1/auth/register`) | creación masiva de cuentas |
| `POST /api/v1/auth/forgot-password` | Render (`/api/v1/auth/forgot-password`) | spam de correos / enumeración |
| `POST /api/v1/auth/reset-password` | Render (`/api/v1/auth/reset-password`) | fuerza bruta de tokens |
| `POST /ml/api/v1/analyze` | ML service Railway (vía `ml-proxy`) | cómputo de IA caro / clave compartida |

> No aplicar límites a `/api/v1/dashboard`, lecturas, pacientes, alertas ni planes:
> son rutas autenticadas con usuarios legítimos y un límite podría romper el uso normal.

## Estado verificado (probes del 2026-08-17)

- **Backend (Render)** — `GET /api/v1/auth/me` → 401 con `www-authenticate: Bearer`.
  Sin headers `X-RateLimit-*`, sin `Retry-After`, sin CORS. No se observa rate limiting.
- **ML service (Railway)** — `GET /health` → 200 público. Sin headers de rate limit.
  `/api/v1/analyze` requiere `X-API-Key` (inyectada server-side por `ml-proxy`).
- **Netlify** — no hay reglas de rate limiting en `netlify.toml` ni configuración visible.

## Dónde se debe implementar (por prioridad)

### 1. Netlify — Redirect-based rate limiting (recomendado, sin dependencia de plan)

Netlify permite **code-based rules** vía `[[redirects.rate_limit]]` en `netlify.toml`.
Disponibilidad (docs oficiales, 2026):

| Feature | Free / Starter / Personal | Pro | Enterprise (HP Edge) |
|---|---|---|---|
| Code-based rules (en código) | 2 por proyecto | 5 por proyecto | 100 por proyecto |
| Targeting por path | ✓ | ✓ | ✓ |
| Block (429) o rewrite | ✓ | ✓ | ✓ |
| UI-based rules (targeting por IP/geo/cookie/header) | — | — | ✓ |

Las reglas en código **funcionan en todos los planes** (el límite es el número de
reglas por proyecto: 2 en Free). Los límites se aplican en el edge **antes** de
ejecutar la función o reenviar al backend, así que un `429` no consume cómputo.

Configuración exacta para auth (reglas por path para NO afectar al dashboard):

```toml
# Proteger login/register (brute force) — 20 req/min por IP
[[redirects]]
  from = "/api/v1/auth/login"
  to = "https://api-dialitech-core-v2.onrender.com/api/v1/auth/login"
  status = 200
  force = true
  [redirects.rate_limit]
    window_limit = 20
    window_size = 60
    aggregate_by = ["ip", "domain"]

[[redirects]]
  from = "/api/v1/auth/register"
  to = "https://api-dialitech-core-v2.onrender.com/api/v1/auth/register"
  status = 200
  force = true
  [redirects.rate_limit]
    window_limit = 10
    window_size = 60
    aggregate_by = ["ip", "domain"]
```

> Orden importante: estas reglas van **antes** del redirect genérico `/api/v1/*`.
> Limitar solo los paths de auth no bloquea dashboard/lecturas/pacientes.

Para **forgot-password / reset-password** (idéntico patrón, p. ej. `window_limit = 10`).

Para **ML analyze** (`/ml/api/v1/analyze`, que reenvía a la Netlify Function
`ml-proxy`): las reglas sobre redirects funcionan en el edge antes de la función,
p. ej. `window_limit = 30` por minuto por IP. Validar en staging que el uso
legítimo (1 request por paciente/ventana) no lo alcance.

### 2. ML Service (FastAPI/Railway) — recomendado a largo plazo

El consumo de cómputo de IA ocurre en el ML service. Implementar rate limiting
**en el propio servicio** (middleware `slowapi` u otro) keyed por `X-API-Key` y/o IP
es la protección más robusta, porque funciona aunque se cambie de host/proxy.

### 3. Backend (Render / ASP.NET Core)

Agregar rate limiter middleware (o account lockout / retraso exponencial) en
`/auth/login` y `/auth/forgot-password` para mitigar fuerza bruta server-side.
Render no ofrece un rate limiter configurable por aplicación; el front es Cloudflare
(infraestructura de Render), no configurable por nosotros.

### 4. Netlify UI rules (solo Enterprise con High-Performance Edge)

Si se tuviera Enterprise, se pueden crear rulesets en la UI
(`Project configuration → Access & security → Rate limiting`) con targeting
avanzado (IP ranges, geolocalización, cookie, header). En el plan actual
desconocido, usar la opción 1 (código).

## Configuración en Netlify (dashboard)

1. No hace falta configuración si se usan reglas en `netlify.toml` (opción 1).
2. Para rulesets UI: `Site configuration → Access & security → Rate limiting` → `Manage rulesets`.
3. Plan requerido para UI: **Enterprise con High-Performance Edge** (verificar en el dashboard).
4. El plan actual no se puede verificar desde aquí: revisar
   `Netlify dashboard → Site configuration → General → Plan`.

## Manejo del 429 en el frontend (ya implementado)

- `src/services/ml/ml.service.js` mapea `429` → "Se alcanzó el límite de solicitudes..."
  (no rompe el flujo).
- `src/services/api.js` no reintenta `429` (no es idempotente-friendly para POST y no
  lo marca como error transitorio). El usuario verá el error del backend.

## Documentos relacionados

- `docs/JWT_STORAGE_MIGRATION.md`: migración de autenticación a cookie HttpOnly.
- `docs/BRANCH_PROTECTION.md`: protección de rama.