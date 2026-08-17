# Branch Protection — Dialitech-Web

Esta guía documenta cómo habilitar protección de rama en GitHub para `main` y
`develop`. **No modifica configuración remota por sí misma**: debe aplicarse
manualmente con permisos de administrador del repositorio.

## Rama `main`

Protecciones recomendadas:

- `Require a pull request before merging` → **habilitado** (1 aprobación mínima).
- `Require status checks to pass before merging` → **habilitado**:
  - `Lint & Typecheck`
  - `Security Audit`
  - `Build`
  - `Tests`
- `Do not allow bypassing the above settings` → **habilitado**.
- `Require conversation resolution before merging` → **habilitado**.
- `Delete branch on merge` → **habilitado**.
- `Allow force pushes` / `Allow deletions` → **deshabilitados**.

## Rama `develop`

Protecciones recomendadas:

- `Require a pull request before merging` → **habilitado**.
- `Require status checks to pass before merging` → **habilitado** (mismas checks).
- `Delete branch on merge` → **habilitado**.

## Configuración vía interfaz de GitHub

1. Ir a `Settings` → `Branches`.
2. `Add branch ruleset` (o `Add rule`).
3. Aplicar los ajustes de la tabla anterior.
4. Guardar.

## Configuración vía `gh` CLI (opcional)

Requisito: `gh auth login` con permisos de administrador sobre el repositorio.

```bash
# Ejemplo para proteger main
gh api \
  -X PUT repos/Shaggy1789/Dialitech-Web/branches/main/protection \
  -H "Accept: application/vnd.github+json" \
  -f "required_status_checks[strict]=true" \
  -f "required_status_checks[checks][][context]=Lint & Typecheck" \
  -f "required_status_checks[checks][][context]=Security Audit" \
  -f "required_status_checks[checks][][context]=Build" \
  -f "required_status_checks[checks][][context]=Tests" \
  -f "required_pull_request_reviews[required_approving_review_count]=1" \
  -f "enforce_admins=true" \
  -f "required_linear_history=true" \
  -f "allow_force_pushes=false" \
  -f "allow_deletions=false"
```

> Nota: el repositorio es **público** y maneja datos de salud. Además de branch
> protection, se recomienda:
> - Mantener los secretos de CI en `Settings → Secrets and variables → Actions`.
> - No almacenar ningún secreto en `.env`, `.env.local` ni en código.
> - Revisar periódicamente `Security` → `Secret scanning` y `Dependabot alerts`.
