import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import router from '../../src/router';
import tokenService from '../../src/services/token.service';
import { useAuthStore } from '../../src/stores/authStore';

const caregiver = {
  id: 'u1',
  name: 'Ana',
  email: 'ana@clinic.com',
  plan: 'Pro',
  role: 'caregiver',
  status: 'Active',
};

function makeToken(expiresInSeconds) {
  const payload = { exp: Math.floor(Date.now() / 1000) + expiresInSeconds };
  return `h.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.s`;
}

function login(expiresInSeconds = 3600) {
  const store = useAuthStore();
  store.setSession({ token: makeToken(expiresInSeconds), caregiver });
}

describe('route guards (protección de rutas)', () => {
  beforeEach(async () => {
    sessionStorage.clear();
    localStorage.clear();
    setActivePinia(createPinia());
    await router.push('/');
  });

  it('redirige a /login cuando el usuario no está autenticado', async () => {
    await router.push('/patients');
    expect(router.currentRoute.value.name).toBe('login');
    expect(router.currentRoute.value.query.redirect).toBe('/patients');
  });

  it('redirige a /login si el token expiró', async () => {
    login(-60); // token ya expirado
    await router.push('/dashboard');
    expect(router.currentRoute.value.name).toBe('login');
    expect(router.currentRoute.value.query.redirect).toBe('/dashboard');
  });

  it('permite el acceso a rutas protegidas con sesión válida', async () => {
    login();
    await router.push('/patients');
    expect(router.currentRoute.value.name).toBe('patients');
  });

  it('redirige a /login si el token no está almacenado aunque la sesión parezca válida', async () => {
    const store = useAuthStore();
    store.setSession({ token: makeToken(3600), caregiver });
    tokenService.removeToken(); // almacén limpio por algún motivo

    await router.push('/patients');
    expect(router.currentRoute.value.name).toBe('login');
  });

  it('un usuario autenticado que visita /login es redirigido a /dashboard', async () => {
    login();
    await router.push('/login');
    expect(router.currentRoute.value.name).toBe('dashboard');
  });

  it('redirige a /forbidden cuando el rol no puede acceder al módulo', async () => {
    const store = useAuthStore();
    store.setSession({
      token: makeToken(3600),
      caregiver: { ...caregiver, role: 'patient' },
    });
    await router.push('/settings');
    expect(router.currentRoute.value.name).toBe('forbidden');
  });

  it('las rutas públicas (home, plans) no requieren autenticación', async () => {
    await router.push('/');
    expect(router.currentRoute.value.name).toBe('home');
    await router.push('/plans');
    expect(router.currentRoute.value.name).toBe('plans');
  });
});