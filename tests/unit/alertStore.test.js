import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

vi.mock('../../src/services/alertService', () => ({
  alertService: {
    getAll: vi.fn(),
    getByPatient: vi.fn(),
    remove: vi.fn(),
  },
}));

import { alertService } from '../../src/services/alertService';
import { useAlertStore } from '../../src/stores/alertStore';

describe('alertStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('fetchAll mapea la API al modelo del frontend', async () => {
    alertService.getAll.mockResolvedValue({
      data: [
        { id: 1, patientName: 'Robert Smith', severity: 3, createdAt: '2026-01-01T10:00:00Z', message: 'HR alta', isRead: false },
        { id: 2, patientName: 'Ana', severity: 0, createdAt: '2026-01-02T10:00:00Z', message: 'Info', isRead: true },
      ],
    });
    const store = useAlertStore();
    await store.fetchAll();

    expect(store.alerts.length).toBe(2);
    expect(store.alerts[0].priority).toBe('Critical');
    expect(store.alerts[0].status).toBe('Active');
    expect(store.alerts[1].priority).toBe('Low');
    expect(store.alerts[1].status).toBe('Resolved');
  });

  it('fetchAll captura error del servicio', async () => {
    alertService.getAll.mockRejectedValue({ response: { data: { message: 'boom' } } });
    const store = useAlertStore();
    await store.fetchAll();
    expect(store.error).toBe('boom');
  });

  it('remove filtra la alerta resuelta', async () => {
    alertService.remove.mockResolvedValue({});
    const store = useAlertStore();
    store.alerts = [{ id: 1 }, { id: 2 }];
    const result = await store.remove(1);
    expect(result.success).toBe(true);
    expect(store.alerts.map((a) => a.id)).toEqual([2]);
  });

  it('remove con ID inválido no llama al servicio', async () => {
    const store = useAlertStore();
    const result = await store.remove(null);
    expect(result.success).toBe(false);
    expect(alertService.remove).not.toHaveBeenCalled();
  });

  it('markAllRead marca como Resolved y devuelve el conteo', () => {
    const store = useAlertStore();
    store.alerts = [
      { id: 1, status: 'Active' },
      { id: 2, status: 'Resolved' },
      { id: 3, status: 'Active' },
    ];
    expect(store.markAllRead()).toBe(2);
    expect(store.alerts.every((a) => a.status === 'Resolved')).toBe(true);
  });

  it('clear restablece el estado', () => {
    const store = useAlertStore();
    store.alerts = [{ id: 1 }];
    store.error = 'x';
    store.clear();
    expect(store.alerts).toEqual([]);
    expect(store.error).toBe('');
  });
});