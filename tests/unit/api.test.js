import { describe, it, expect, vi, beforeEach } from 'vitest';

const state = vi.hoisted(() => {
  const reqHandlers = { fulfilled: null, rejected: null };
  const resHandlers = { fulfilled: null, rejected: null };
  const instance = vi.fn();
  instance.interceptors = {
    request: { use: (f, r) => { reqHandlers.fulfilled = f; reqHandlers.rejected = r; } },
    response: { use: (f, r) => { resHandlers.fulfilled = f; resHandlers.rejected = r; } },
  };
  instance.defaults = {};
  return { reqHandlers, resHandlers, instance };
});

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => state.instance),
  },
}));

vi.mock('../../src/services/token.service', () => ({
  __esModule: true,
  default: {
    getToken: vi.fn(),
    setToken: vi.fn(),
    removeToken: vi.fn(),
    getStoredUser: vi.fn(),
    setStoredUser: vi.fn(),
    removeStoredUser: vi.fn(),
    clearAuthStorage: vi.fn(),
  },
}));

import '../../src/services/api';
import tokenService from '../../src/services/token.service';
import { authEvents } from '../../src/services/authEvents';

describe('api.js (interceptores HTTP y manejo 401/403)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    state.instance.mockReset();
  });

  it('agrega Authorization Bearer cuando hay token en una ruta protegida', () => {
    tokenService.getToken.mockReturnValue('jwt-abc');
    const config = state.reqHandlers.fulfilled({ url: '/patients', method: 'get', headers: {} });
    expect(config.headers.Authorization).toBe('Bearer jwt-abc');
  });

  it('NO agrega Bearer en auth/login, auth/register ni recovery', () => {
    tokenService.getToken.mockReturnValue('jwt-abc');
    for (const url of ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/recovery/reset']) {
      const config = state.reqHandlers.fulfilled({ url, method: 'post', headers: {} });
      expect(config.headers.Authorization).toBeUndefined();
    }
  });

  it('respuesta exitosa pasa tal cual', () => {
    const response = { status: 200, data: {} };
    expect(state.resHandlers.fulfilled(response)).toBe(response);
  });

  it('401 en ruta protegida: limpia sesión y emite session-expired', async () => {
    const emitted = [];
    authEvents.on('session-expired', (p) => emitted.push(p));
    const error = { config: { url: '/patients' }, response: { status: 401 } };

    await expect(state.resHandlers.rejected(error)).rejects.toBe(error);
    expect(tokenService.clearAuthStorage).toHaveBeenCalled();
    expect(emitted.length).toBe(1);
  });

  it('401 en login NO limpia la sesión', async () => {
    const error = { config: { url: '/auth/login', method: 'post' }, response: { status: 401 } };
    await expect(state.resHandlers.rejected(error)).rejects.toBe(error);
    expect(tokenService.clearAuthStorage).not.toHaveBeenCalled();
  });

  it('403 emite evento forbidden', async () => {
    const emitted = [];
    authEvents.on('forbidden', (p) => emitted.push(p));
    const error = { config: { url: '/alerts' }, response: { status: 403 } };

    await expect(state.resHandlers.rejected(error)).rejects.toBe(error);
    expect(emitted.length).toBe(1);
  });

  it('reintenta GET idempotente ante 5xx', async () => {
    state.instance.mockResolvedValue({ status: 200, data: {} });
    const error = { config: { url: '/dashboard', method: 'get', headers: {} }, response: { status: 503 } };

    const result = await state.resHandlers.rejected(error);
    expect(state.instance).toHaveBeenCalledTimes(1);
    expect(result.status).toBe(200);
  });

  it('no reintenta POST ante 5xx (no idempotente)', async () => {
    const error = { config: { url: '/auth/login', method: 'post', headers: {} }, response: { status: 500 } };
    await expect(state.resHandlers.rejected(error)).rejects.toBe(error);
    expect(state.instance).not.toHaveBeenCalled();
  });
});