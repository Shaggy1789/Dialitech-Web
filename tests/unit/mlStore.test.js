import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

vi.mock('../../src/services/ml/ml.service', () => ({
  __esModule: true,
  mlService: {
    analyze: vi.fn(),
    health: vi.fn(),
  },
  default: {
    analyze: vi.fn(),
    health: vi.fn(),
  },
}));

import { mlService } from '../../src/services/ml/ml.service';
import { useMlStore } from '../../src/stores/mlStore';

function buildReadings(count, options = {}) {
  const readings = [];
  for (let i = 0; i < count; i += 1) {
    const isAnomaly = options.anomalyIndex === i;
    readings.push({
      // Solo heartRate se desvía en la anomalía; oxygen/activity permanecen estables
      // para que computeMostDeviating apunte inequívocamente a heartRate.
      heartRate: isAnomaly ? 120 : 70,
      oxygen: 97,
      activity: 2,
      timestamp: new Date(Date.UTC(2026, 0, 1, 0, i)).toISOString(),
    });
  }
  return readings;
}

describe('mlStore (análisis IA)', () => {
  beforeEach(() => {
    sessionStorage.clear();
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('marca insuficiencia de datos cuando no hay lecturas', async () => {
    const store = useMlStore();
    await store.analyzePatient('p1', []);
    expect(store.insufficientData).toBe(true);
    expect(store.insufficientReason).toContain('12');
    expect(store.analysis).toBeNull();
    expect(mlService.analyze).not.toHaveBeenCalled();
  });

  it('marca insuficiencia de datos con menos de 12 lecturas', async () => {
    const store = useMlStore();
    await store.analyzePatient('p1', buildReadings(5));
    expect(store.insufficientData).toBe(true);
    expect(mlService.analyze).not.toHaveBeenCalled();
  });

  it('descarta lecturas incompletas y reporta actividad faltante', async () => {
    const store = useMlStore();
    const readings = buildReadings(12).map((r) => ({ ...r, activity: undefined }));
    await store.analyzePatient('p1', readings);
    expect(store.insufficientData).toBe(true);
    expect(store.insufficientReason).toContain('actividad');
    expect(mlService.analyze).not.toHaveBeenCalled();
  });

  it('normaliza la respuesta del ML y enriquece anomalías con la ventana', async () => {
    const readings = buildReadings(12, { anomalyIndex: 5 });
    mlService.analyze.mockResolvedValue({
      data: {
        patientId: 'p1',
        modelVersion: 'v2.0',
        riskPrediction: { riskScore: 0.82, riskLevel: 'High', recommendation: 'Monitor' },
        trendAnalysis: { heartRate: { direction: 'ASCENDING', confidence: 0.9 } },
        anomalyDetection: {
          anomalyDetected: true,
          anomalyScore: 0.9,
          affectedReadingsIndexes: [5],
        },
      },
    });

    const store = useMlStore();
    await store.analyzePatient('p1', readings);

    expect(store.hasAnalysis).toBe(true);
    expect(store.riskScore).toBe(0.82);
    expect(store.riskLevel).toBe('High');
    expect(store.modelVersion).toBe('v2.0');
    expect(store.trends.heartRate).toBe('ASCENDING');
    expect(store.anomalies.length).toBe(1);
    expect(store.anomalies[0].readingIndex).toBe(5);
    // La anomalía indexada se enriquece con la lectura real de la ventana
    expect(store.anomalies[0].reading.heartRate).toBe(120);
    // deviation apunta a la métrica más desviada (heartRate 120 vs media ~74)
    expect(store.anomalies[0].deviation.metric).toBe('heartRate');
  });

  it('mapea 401/403 a mensaje de permiso', async () => {
    mlService.analyze.mockRejectedValue({ response: { status: 401 } });
    const store = useMlStore();
    await store.analyzePatient('p1', buildReadings(12));
    expect(store.analysisError).toContain('No tienes permiso');
    expect(store.hasAnalysis).toBe(false);
  });

  it('mapea 429 (rate limit) a mensaje de límite', async () => {
    mlService.analyze.mockRejectedValue({ response: { status: 429 } });
    const store = useMlStore();
    await store.analyzePatient('p1', buildReadings(12));
    expect(store.analysisError).toContain('límite');
  });

  it('checkHealth refleja disponibilidad del servicio', async () => {
    const store = useMlStore();
    mlService.health.mockResolvedValue({});
    await store.checkHealth();
    expect(store.serviceDown).toBe(false);

    mlService.health.mockRejectedValue(new Error('down'));
    await store.checkHealth();
    expect(store.serviceDown).toBe(true);
  });

  it('reset limpia el estado del análisis', async () => {
    const store = useMlStore();
    store.analysisError = 'algo';
    store.reset();
    expect(store.analysis).toBeNull();
    expect(store.analysisError).toBe('');
    expect(store.insufficientData).toBe(false);
  });
});