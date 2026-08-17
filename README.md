# Dialitech-Web (DiaMonitor)

Frontend web de **DiaMonitor**, la plataforma de monitoreo para pacientes en
diálisis. Permite a cuidadores y clínicas visualizar lecturas de signos vitales
en tiempo real, gestionar pacientes, revisar alertas críticas, analizar
tendencias con **IA** y administrar planes de suscripción.

> ⚠️ **Repositorio público**: este repositorio contiene la arquitectura y los
> endpoints de una aplicación que maneja datos de salud. No se suben secretos
> (ver [`docs/SECURITY_PUBLIC_REPO.md`](docs/SECURITY_PUBLIC_REPO.md)).

---

## Stack

| Capa | Tecnología |
|------|------------|
| Framework | **Vue 3** (Composition API, `<script setup>`) |
| Build | **Vite 8** |
| Estado | **Pinia** |
| Router | **vue-router** (history mode) |
| i18n | **vue-i18n** (es-MX / en) |
| Gráficas | **ECharts** + **vue-echarts** |
| HTTP | **Axios** |
| Despliegue | **Netlify** (static + Functions) |

## Arquitectura

```
Navegador (SPA)
   │  /api/v1/*  ──►  Netlify redirect  ──►  Backend (api-dialitech-core-v2.onrender.com)
   │  /ml/*      ──►  Netlify Function    ──►  ML Service (dialitechmlservice-production.up.railway.app)
   │                                    (inyecta X-API-Key server-side)
```

- **Same-origin proxy**: el navegador solo habla con el mismo origen; Netlify
  redirige `/api/v1/*` al backend y `/ml/*`/`/api/ml/*` a la Netlify Function
  `ml-proxy`. Esto evita CORS y mantiene la API key de ML fuera del bundle.
- **SPA**: rutas con history mode; fallback a `index.html`.

## Estructura principal

```
├─ .github/                 # CI/CD, Dependabot, CODEOWNERS
├─ docs/                    # Reportes técnicos y de seguridad
├─ netlify/
│  └─ functions/ml-proxy.js # Proxy ML (inyección server-side de X-API-Key)
├─ public/                  # Assets estáticos (favicon, theme-init)
├─ src/
│  ├─ components/           # Componentes compartidos
│  ├─ composables/          # Lógica reutilizable (useAccount, useProfile, …)
│  ├─ config/               # security.js, plans.js
│  ├─ data/                 # Planes/pagos
│  ├─ i18n/                 # Traducciones es/en
│  ├─ layouts/              # DashboardLayout, PublicLayout
│  ├─ modules/              # alerts, authentication, dashboard, patients,
│  │                        # payments, plans, register, settings, user-management
│  ├─ pages/                # Vistas raíz (Home, Login, Dashboard, 404, …)
│  ├─ router/               # Rutas y guards de autenticación/permisos
│  ├─ services/             # API (axios), auth, token, realtime, ML, settings…
│  ├─ stores/               # Stores Pinia (auth, patient, alert, dashboard, …)
│  └─ utils/                # validators.js
├─ index.html
├─ netlify.toml             # Build, redirects, headers de seguridad (CSP)
└─ vite.config.js           # Proxy de dev, headers de preview
```

## Variables de entorno

Copia `.env.example` a `.env` (desarrollo local) y configura lo necesario.

| Variable | Dónde | Descripción |
|----------|-------|-------------|
| `VITE_API_URL` | Build/CI | Origen del backend (opcional; vacío = proxy `/api/v1`) |
| `ML_API_URL` | Netlify (server) | URL del ML Service |
| `ML_API_KEY` | Netlify (server) | Clave del ML Service — **solo server-side, nunca en el bundle** |

> `VITE_ML_API_URL` / `VITE_ML_API_KEY` se eliminaron: ya no se usan.

## Instalación y desarrollo

```bash
npm install
npm run dev          # Dev server de Vite (proxy /api y /ml)
```

Para probar las Netlify Functions en local (proxy ML con la key):

```bash
npm install -g netlify-cli
netlify dev          # Expone functions en localhost:8888
```

`.env.local` (gitignored) sugerido para dev:

```
VITE_API_URL=
ML_API_URL=https://dialitechmlservice-production.up.railway.app
ML_API_KEY=tu-clave-de-desarrollo
```

## Build

```bash
npm run build        # Genera dist/
npm run preview      # Sirve el build local (con headers de seguridad)
```

## Despliegue

- **Netlify**: configurado vía `netlify.toml` (build `npm run build`, publish
  `dist`, functions `netlify/functions`).
- **CI/CD**: `.github/workflows/ci.yml` corre lint, typecheck, `npm audit`,
  TruffleHog (secret scan), dependency review, build con verificación de
  secretos en `dist/`, SBOM, tests y deploy de preview.

## Integración API

- Base: `/api/v1` (same-origin). Autenticación: `Authorization: Bearer <JWT>`.
- El token se almacena en **sessionStorage** (mejora frente a `localStorage`).
  El backend no soporta cookies HttpOnly todavía (ver `src/config/security.js`).
- `src/services/api.js` maneja interceptores, reintentos, expiración 401 y
  notificaciones.

## Integración ML

- El cliente llama a `/ml/api/v1/analyze` (same-origin).
- La Netlify Function `ml-proxy` inyecta `X-API-Key` desde `ML_API_KEY`
  (variable de servidor) y reenvía la petición al ML Service.
- La API key **nunca** llega al navegador.

## Seguridad

- **CSP** estricta en producción (`netlify.toml`): `script-src 'self'` (sin
  eval), `style-src 'self' 'unsafe-inline'` (requerido por ECharts).
- Headers de seguridad (nosniff, frame DENY, referrer, permissions, COOP/CORP).
- Política de contraseñas fuerte (`src/config/security.js`).
- Sesión con timeout de inactividad y renovación (JWT).
- Secret scan en CI (TruffleHog) y verificación de `dist/` en el build.
- CORS del proxy ML restringido a orígenes permitidos (`ALLOWED_ORIGINS`).

## DevSecOps

- **CI/CD**: pipeline con lint, typecheck, `npm audit`, TruffleHog, dependency
  review, build + secret scan de `dist/`, SBOM (`npm sbom`, artifact), tests y
  deploy preview.
- **Dependabot**: actualizaciones semanales de npm y GitHub Actions.
- **CODEOWNERS**: revisión obligatoria de cambios críticos
  (workflows, seguridad, auth, proxy ML, Netlify).
- **Branch protection**: documentado en
  [`docs/BRANCH_PROTECTION.md`](docs/BRANCH_PROTECTION.md).
- **Rate limiting**: pendiente server-side; ver
  [`docs/RATE_LIMITING.md`](docs/RATE_LIMITING.md).

## Licencia

Privado/uso interno del equipo Dialitech (sin licencia pública).