import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

vi.mock('../../src/services/dashboardService', () => ({
  dashboardService: {
    getSummary: vi.fn(),
    getPatientStatus: vi.fn(),
    getPatientReadings: vi.fn(),
  },
}));

vi.mock('../../src/services/realtimeService', () => ({
  useRealtimeReadings: () => ({
    subscribe: vi.fn(() => () => {}),
    setPatient: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    forceRefresh: vi.fn(() => Promise.resolve()),
    connectionStatus: { value: 'connected' },
  }),
}));

import { dashboardService } from '../../src/services/dashboardService';
import { useDashboardStore } from '../../src/stores/dashboardStore';

const summary = {
  patients: [
    { patientId: 'p1', lastHeartRate: 75 },
    { patientId: 'p2', lastHeartRate: 85 },
  ],
  totalPatients: 2,
  activeAlerts: 3,
  patientsWithDevice: 1,
};

describe('dashboardStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('fetchSummary carga datos, calcula promedio y selecciona el primer paciente', async () => {
    dashboardService.getSummary.mockResolvedValue({ data: summary });
    const store = useDashboardStore();

    await store.fetchSummary();

    expect(store.totalPatients).toBe(2);
    expect(store.activeAlerts).toBe(3);
    expect(store.averageHeartRate).toBe(80); // (75+85)/2
    expect(store.selectedPatientId).toBe('p1');
    expect(store.summaryLoading).toBe(false);
  });

  it('fetchSummary captura el error del servidor', async () => {
    dashboardService.getSummary.mockRejectedValue(new Error('offline'));
    const store = useDashboardStore();

    await store.fetchSummary();

    expect(store.summaryError).toContain('No se pudieron cargar');
    expect(store.summary).toBeNull();
  });

  it('fetchReadings ordena cronológicamente', async () => {
    const readings = [
      { timestamp: '2026-01-02T00:00:00Z' },
      { timestamp: '2026-01-01T00:00:00Z' },
      { timestamp: '2026-01-03T00:00:00Z' },
    ];
    dashboardService.getPatientReadings.mockResolvedValue({ data: { readings } });
    const store = useDashboardStore();
    store.selectedPatientId = 'p1';

    await store.fetchReadings('p1', '30d', true);

    expect(store.readings[0].timestamp).toBe('2026-01-01T00:00:00Z');
    expect(store.readings[2].timestamp).toBe('2026-01-03T00:00:00Z');
    expect(store.readingsCount).toBe(3);
  });

  it('appendReadings deduplica por timestamp y reordena', () => {
    const store = useDashboardStore();
    store.readings = [{ timestamp: '2026-01-02T00:00:00Z' }];
    store.appendReadings([
      { timestamp: '2026-01-01T00:00:00Z' },
      { timestamp: '2026-01-02T00:00:00Z' }, // duplicado
      { timestamp: '2026-01-03T00:00:00Z' },
    ]);
    expect(store.readingsCount).toBe(3);
    expect(store.readings[0].timestamp).toBe('2026-01-01T00:00:00Z');
  });

  it('fetchPatientDetail carga estado y captura error', async () => {
    dashboardService.getPatientStatus.mockResolvedValue({ data: { status: 'stable' } });
    const store = useDashboardStore();
    await store.fetchPatientDetail('p1', true);
    expect(store.patientDetail).toEqual({ status: 'stable' });

    dashboardService.getPatientStatus.mockRejectedValue(new Error('x'));
    await store.fetchPatientDetail('p2', true);
    expect(store.patientDetailError).toContain('No se pudo cargar');
  });

  it('selectPatient limpia estado anterior y carga detalle + lecturas', async () => {
    dashboardService.getPatientStatus.mockResolvedValue({ data: { status: 'stable' } });
    dashboardService.getPatientReadings.mockResolvedValue({ data: { readings: [] } });
    const store = useDashboardStore();
    store.readings = [{ timestamp: '2026-01-01T00:00:00Z' }];
    store.patientDetail = { status: 'old' };

    await store.selectPatient('p9');

    expect(store.selectedPatientId).toBe('p9');
    expect(store.patientDetail).toEqual({ status: 'stable' });
    expect(store.readings).toEqual([]);
  });

  it('reset limpia todo el estado', async () => {
    const store = useDashboardStore();
    store.summary = summary;
    store.selectedPatientId = 'p1';
    store.readings = [{ timestamp: '2026-01-01T00:00:00Z' }];

    store.reset();

    expect(store.summary).toBeNull();
    expect(store.selectedPatientId).toBeNull();
    expect(store.readings).toEqual([]);
  });
});