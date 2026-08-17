export const STORAGE_KEYS = Object.freeze({
  TOKEN: 'token',
  USER: 'user',
});

// Almacenamiento del JWT.
// El backend actual autentica con `Authorization: Bearer <token>` (devuelto en el body
// del login) y NO soporta cookies HttpOnly (withCredentials=false, sin Set-Cookie).
// Por eso se usa sessionStorage como mejora temporal frente a localStorage:
//   - El token ya no persiste al cerrar el navegador.
//   - sessionStorage sobrevive al refresh dentro de la misma pestaña (sesión continua).
// Tradeoff conocido: la sesión NO se comparte entre pestañas/ventanas nuevas.
// Migrar a cookie HttpOnly requiere soporte del backend.
export const AUTH_CONFIG = Object.freeze({
  TOKEN_CLOCK_SKEW_SECONDS: 30,
  TOKEN_STORAGE: 'sessionStorage',
});

export const SESSION_CONFIG = Object.freeze({
  INACTIVITY_TIMEOUT_MS: 15 * 60 * 1000,
  WARNING_BEFORE_MS: 60 * 1000,
  ACTIVITY_EVENTS: ['mousemove', 'keydown', 'click', 'scroll', 'touchstart', 'wheel'],
  OVERRIDE_KEY: 'session_inactivity_timeout_ms',
});

export const PASSWORD_POLICY = Object.freeze({
  MIN_LENGTH: 6,
  MAX_LENGTH: 128,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_DIGIT: true,
  REQUIRE_SPECIAL: true,
});

export const FIELD_LIMITS = Object.freeze({
  NAME_MAX: 60,
  LASTNAME_MAX: 60,
  PHONE_MAX: 20,
  EMAIL_MAX: 254,
});

export const PUBLIC_ROUTES = Object.freeze([
  'home',
  'login',
  'register',
  'plans',
  'forgot-password',
]);

export const GUEST_ONLY_ROUTES = Object.freeze(['login', 'register']);

export const ROUTE_ACTION_DEFAULT = 'access';
