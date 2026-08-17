# Seguridad y estado del repositorio público

## Estado

**Dialitech-Web es un repositorio PÚBLICO** (`github.com/Shaggy1789/Dialitech-Web`)
y contiene información sobre la arquitectura y los endpoints de una aplicación
que maneja **datos de salud** (lecturas de pacientes, alertas, perfiles).

### Hallazgos del análisis de seguridad

- **No se detectaron secretos reales** en el código ni en el historial de Git
  (escaneo de alta entropía, TruffleHog y revisión manual).
  - El `.env` fue commiteado históricamente pero solo contenía URLs públicas y
    `VITE_ML_API_KEY=test-key` (placeholder). Fue eliminado del historial
    vigente y actualmente `.env` está en `.gitignore`.
  - La API key del servicio ML se inyecta **server-side** en la Netlify Function
    `ml-proxy` y **nunca** llega al bundle del navegador.
- **Riesgo**: al ser público, cualquiera puede ver los endpoints del backend
  (`api-dialitech-core-v2.onrender.com`) y del servicio ML
  (`dialitechmlservice-production.up.railway.app`), y atacar directamente esos
  servicios. Los endpoints siguen protegidos por autenticación del backend.

## Recomendación

1. **Mover el repositorio a privado** (decisión del equipo propietario):
   `Settings → General → Danger Zone → Change repository visibility`.
2. Si permanece público:
   - No exponer logs, datos reales de pacientes, capturas con datos personales
     reales ni credenciales.
   - Mantener los secretos de CI en GitHub Secrets.
   - Revisar `Security → Secret scanning` periódicamente.
3. Los URLs de backend que aparecen en `netlify.toml` / `vite.config.js` son
   **necesarios para que la aplicación funcione** y no deben eliminarse.

## Nota para los reportes en `docs/`

Los reportes (`REPORTE_*.md`) contienen URLs públicas del backend (también
presentes en la configuración de despliegue). No contienen credenciales. Si se
hace privado el repositorio, pueden mantenerse tal cual.