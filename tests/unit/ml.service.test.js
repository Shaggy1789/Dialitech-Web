import { describe, it, expect, vi, beforeEach } from 'vitest';

const state = vi.hoisted(() => {
  const handlers = { request: null, response: null };
  const instance = {
    defaults: {},
    interceptors: {
      request: { use: vi.fn((fn) => { handlers.request = fn; }) },
      response: { use: vi.fn((fulfilled, rejected) => { handlers.response = rejected; }) },
    },
    post: vi.fn(),
    get: vi.fn(),
  };
  return { instance, handlers };
});

vi.mock('axios', () => ({
  default: {
    create: vi.fn((config) => {
      Object.assign(state.instance.defaults, config || {});
      return state.instance;
    }),
  },
}));

import mlService from '../../src/services/ml/ml.service';

describe('ml.service (proxy ML, API key server-side)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('usa la ruta same-origin /ml como base', () => {
    expect(state.instance.defaults.baseURL).toBe('/ml');
    expect(state.instance.defaults.headers).not.toHaveProperty('X-API-Key');
  });

  it('analyze hace POST a /api/v1/analyze con payload camelCase', () => {
    const readings = [{ heartRate: 70, oxygen: 97, activity: 2, timestamp: '2026-01-01T00:00:00Z' }];
    mlService.analyze('p1', readings, 12);
    expect(state.instance.post).toHaveBeenCalledWith('/api/v1/analyze', {
      patientId: 'p1',
      windowSize: 12,
      readings,
    });
  });

  it('health y modelInfo usan GET', () => {
    mlService.health();
    expect(state.instance.get).toHaveBeenCalledWith('/health');
    mlService.modelInfo();
    expect(state.instance.get).toHaveBeenCalledWith('/api/v1/model-info');
  });

  it('la barrera de request rechaza baseURL indefinida', async () => {
    const promise = state.handlers.request({ baseURL: 'undefined', method: 'get' });
    await expect(promise).rejects.toMatchObject({ isMlConfigError: true });
  });

  it('acepta baseURL válida', async () => {
    const config = state.handlers.request({ baseURL: '/ml', method: 'get' });
    expect(config).toBeDefined();
  });

  describe('mapeo de errores del proxy', () => {
    it('401/403 -> isMlConfigError', async () => {
      const handler = state.handlers.response;
      await expect(handler({ response: { status: 401 } })).rejects.toMatchObject({ isMlConfigError: true });
      await expect(handler({ response: { status: 403 } })).rejects.toMatchObject({ isMlConfigError: true });
    });

    it('404 -> isMlConfigError', async () => {
      await expect(state.handlers.response({ response: { status: 404 } })).rejects.toMatchObject({ isMlConfigError: true });
    });

    it('429 -> isMlConfigError (rate limit)', async () => {
      await expect(state.handlers.response({ response: { status: 429 } })).rejects.toMatchObject({ isMlConfigError: true });
    });

    it('5xx -> isMlConfigError', async () => {
      await expect(state.handlers.response({ response: { status: 500 } })).rejects.toMatchObject({ isMlConfigError: true });
    });

    it('error sin respuesta (red) -> isMlConfigError', async () => {
      await expect(state.handlers.response(new Error('Network Error'))).rejects.toMatchObject({ isMlConfigError: true });
    });
  });
});