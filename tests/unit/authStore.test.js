import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

vi.mock('../../src/services/auth/auth.service', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    authService: {
      ...mod.authService,
      login: vi.fn(),
      register: vi.fn(),
      me: vi.fn(),
    },
  };
});

import { authService } from '../../src/services/auth/auth.service';
import { useAuthStore } from '../../src/stores/authStore';
import tokenService from '../../src/services/token.service';

const caregiver = {
  id: 'u1',
  name: 'Ana',
  lastname: 'García',
  email: 'ana@clinic.com',
  plan: 'Pro',
  role: 'caregiver',
  status: 'Active',
};

const token = `h.${Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.s`;

function makeLoginError(status, message, fields) {
  const data = { message };
  if (fields && Object.keys(fields).length) data.errors = fields;
  return {
    response: { status, data },
    message: 'Request failed',
  };
}

describe('authStore (autenticación)', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('login exitoso: establece token, usuario y sesión válida', async () => {
    authService.login.mockResolvedValue({ data: { token, caregiver } });
    const store = useAuthStore();

    const result = await store.login('ana@clinic.com', 'Abcdef1!');

    expect(result.success).toBe(true);
    expect(store.isAuthenticated).toBe(true);
    expect(store.userEmail).toBe('ana@clinic.com');
    expect(store.plan).toBe('Pro');
    expect(tokenService.getToken()).toBe(token);
    expect(tokenService.getStoredUser().id).toBe('u1');
  });

  it('login fallido: no autentica y expone errores de campo', async () => {
    authService.login.mockRejectedValue(makeLoginError(400, 'Validación fallida', { Password: ['Incorrecta'] }));
    const store = useAuthStore();

    const result = await store.login('ana@clinic.com', 'mala');

    expect(result.success).toBe(false);
    expect(store.isAuthenticated).toBe(false);
    expect(store.fieldErrors.password).toBe('Incorrecta');
  });

  it('setSession con token/caregiver ausentes fuerza logout', () => {
    const store = useAuthStore();
    store.setSession({});
    expect(store.isAuthenticated).toBe(false);
    expect(tokenService.getToken()).toBe('');
  });

  it('logout limpia estado y almacén', async () => {
    authService.login.mockResolvedValue({ data: { token, caregiver } });
    const store = useAuthStore();
    await store.login('ana@clinic.com', 'Abcdef1!');
    expect(store.isAuthenticated).toBe(true);

    store.logout();

    expect(store.isAuthenticated).toBe(false);
    expect(store.user).toBeNull();
    expect(tokenService.getToken()).toBe('');
    expect(tokenService.getStoredUser()).toBeNull();
  });

  it('fetchMe con 401 cierra la sesión', async () => {
    authService.login.mockResolvedValue({ data: { token, caregiver } });
    const store = useAuthStore();
    await store.login('ana@clinic.com', 'Abcdef1!');

    authService.me.mockRejectedValue(makeLoginError(401, 'No autorizado'));
    const ok = await store.fetchMe();

    expect(ok).toBe(false);
    expect(store.isAuthenticated).toBe(false);
  });

  it('fetchMe exitoso actualiza el usuario', async () => {
    authService.login.mockResolvedValue({ data: { token, caregiver } });
    const store = useAuthStore();
    await store.login('ana@clinic.com', 'Abcdef1!');

    authService.me.mockResolvedValue({ data: { ...caregiver, name: 'Ana María' } });
    const ok = await store.fetchMe();

    expect(ok).toBe(true);
    expect(store.userName).toBe('Ana María');
  });

  it('refreshSession con token inválido hace logout', async () => {
    const expiredToken = `h.${Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 60 })).toString('base64url')}.s`;
    const store = useAuthStore();
    store.setSession({ token: expiredToken, caregiver });

    const ok = await store.refreshSession();

    expect(ok).toBe(false);
    expect(store.isAuthenticated).toBe(false);
  });

  it('register propaga éxito/fallo', async () => {
    const store = useAuthStore();
    authService.register.mockResolvedValue({ data: { id: 'u2' } });
    expect((await store.register({ email: 'b@c.com' })).success).toBe(true);

    authService.register.mockRejectedValue(makeLoginError(409, 'Ya existe'));
    const res = await store.register({ email: 'b@c.com' });
    expect(res.success).toBe(false);
    expect(res.error).toBe('Ya existe');
  });
});