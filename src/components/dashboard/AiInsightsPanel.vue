<template>
  <section class="ai-panel">
    <header class="panel-header">
      <div class="panel-heading">
        <span class="ai-icon" aria-hidden="true">🧠</span>
        <div class="heading-text">
          <h2 class="panel-title">Análisis IA</h2>
          <span class="panel-status" :class="statusClass">{{ statusText }}</span>
        </div>
      </div>
      <span v-if="mlStore.lastUpdated" class="updated-at">Últ. análisis {{ formatTime(mlStore.lastUpdated) }}</span>
    </header>

    <div v-if="mlStore.serviceDown && !mlStore.hasAnalysis" class="state-block">
      <span class="state-icon" aria-hidden="true">⚠️</span>
      <p class="state-title">IA no disponible</p>
      <p class="state-desc">El servicio de análisis IA no está disponible en este momento. El resto del panel sigue funcionando.</p>
    </div>

    <div v-else-if="mlStore.analysisError" class="error-banner">
      <div class="error-text">
        <strong>No se pudo completar el análisis</strong>
        <span>{{ mlStore.analysisError }}</span>
      </div>
      <button class="retry-btn" @click="$emit('retry')">Reintentar</button>
    </div>

    <div v-else-if="mlStore.analyzing" class="state-block">
      <div class="spinner" aria-label="Cargando análisis" />
      <p class="state-title">Analizando datos…</p>
      <p class="state-desc">El modelo está procesando las lecturas del paciente.</p>
    </div>

    <div v-else-if="!hasReadings" class="state-block">
      <span class="state-icon" aria-hidden="true">📊</span>
      <p class="state-title">Esperando suficientes lecturas…</p>
      <p class="state-desc">Selecciona un paciente con lecturas históricas para comenzar el análisis de IA.</p>
    </div>

    <div v-else-if="mlStore.insufficientData" class="state-block">
      <span class="state-icon" aria-hidden="true">🔢</span>
      <p class="state-title">Se necesitan al menos 12 lecturas</p>
      <p class="state-desc">{{ mlStore.insufficientReason || `Actualmente hay ${readingsCount} lecturas. Recarga con un rango más amplio.` }}</p>
    </div>

    <div v-else-if="!mlStore.hasAnalysis" class="state-block">
      <div class="spinner" aria-label="Preparando análisis" />
      <p class="state-title">Preparando análisis…</p>
    </div>

    <template v-else>
      <div class="risk-row">
        <svg class="gauge" viewBox="0 0 200 118" role="img" :aria-label="`Riesgo: ${mlStore.riskLevel || 'desconocido'} · ${scoreText}`">
          <path class="gauge-track" d="M 18 100 A 82 82 0 0 1 182 100" />
          <path
            v-if="gaugeArc"
            class="gauge-arc"
            :class="riskState"
            :d="gaugeArc"
          />
          <line
            v-if="gaugeArc"
            class="gauge-needle"
            :class="riskState"
            :x1="needle.x1"
            :y1="needle.y1"
            :x2="needle.x2"
            :y2="needle.y2"
          />
          <circle class="gauge-pivot" cx="100" cy="100" r="5" />
        </svg>
        <div class="risk-meta">
          <span class="risk-label">Risk Score</span>
          <strong class="risk-value">{{ scoreText }}</strong>
          <span class="risk-level" :class="riskState">{{ mlStore.riskLevel || 'Sin nivel' }}</span>
          <span v-if="mlStore.riskRecommendation" class="risk-recommendation">{{ mlStore.riskRecommendation }}</span>
          <span v-if="mlStore.modelVersion" class="model-version">Modelo: {{ mlStore.modelVersion }}</span>
        </div>
      </div>

      <div v-if="trendEntries.length" class="block">
        <h3 class="block-title">Tendencias</h3>
        <div class="trend-grid">
          <div v-for="t in trendEntries" :key="t.label" class="trend-chip">
            <span class="trend-arrow" :class="t.state">{{ t.arrow }}</span>
            <span class="trend-label" :title="t.raw">{{ t.label }}</span>
          </div>
        </div>
      </div>

      <div v-if="normalizedPatterns.length" class="block">
        <h3 class="block-title">Patrones detectados</h3>
        <div class="tag-list">
          <span v-for="(p, i) in normalizedPatterns" :key="i" class="tag">{{ p }}</span>
        </div>
      </div>

      <div v-if="normalizedAnomalies.length" class="block">
        <h3 class="block-title">Anomalías</h3>
        <ul class="anomaly-list">
          <li v-for="(a, i) in normalizedAnomalies" :key="i" class="anomaly-card">
            <div class="anomaly-head">
              <strong class="anomaly-name">{{ a.title }}</strong>
              <span v-if="a.severity" class="severity-badge" :class="a.severityClass">{{ a.severity }}</span>
            </div>

            <dl class="anomaly-meta">
              <template v-if="a.valueText !== null && a.valueText !== undefined">
                <div class="meta-row">
                  <dt>Valor</dt>
                  <dd>{{ a.valueText }}</dd>
                </div>
              </template>
              <template v-if="a.dateText">
                <div class="meta-row">
                  <dt>Fecha</dt>
                  <dd>{{ a.dateText }}</dd>
                </div>
              </template>
            </dl>

            <div class="anomaly-why">
              <span class="why-label">¿Por qué?</span>
              <p class="why-text">{{ a.explanation }}</p>
            </div>

            <div v-if="a.metaChips.length" class="anomaly-meta-chips">
              <span v-for="(c, j) in a.metaChips" :key="j" class="chip" :class="c.class" :title="c.title">{{ c.text }}</span>
            </div>
          </li>
        </ul>
      </div>

      <div v-if="normalizedPredictions.length" class="block">
        <h3 class="block-title">Predicciones</h3>
        <ul class="pred-list">
          <li v-for="(p, i) in normalizedPredictions" :key="i" class="pred-item">{{ p }}</li>
        </ul>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useMlStore } from '../../stores/mlStore';

const props = defineProps({
  readings: { type: Array, default: () => [] },
  patientId: { type: [String, Number], default: null },
});

defineEmits(['retry']);

const mlStore = useMlStore();

const hasReadings = computed(() => props.readings.length > 0);
const readingsCount = computed(() => props.readings.length);

const scoreText = computed(() => {
  const score = mlStore.riskScore;
  if (score === null || score === undefined) return '--';
  const n = Number(score);
  if (!Number.isFinite(n)) return '--';
  return n > 1 ? String(Math.round(n)) : n.toFixed(2);
});

function clampScore(score) {
  const n = Number(score);
  if (!Number.isFinite(n)) return 0;
  return n > 1 ? n / 100 : n;
}

function trendState(value) {
  const s = String(value ?? '').toLowerCase();
  if (['up', 'increase', 'increasing', 'ascending', 'sube', 'aumento', 'alta'].includes(s)) return 'up';
  if (['down', 'decrease', 'decreasing', 'descending', 'baja', 'disminucion', 'bajo'].includes(s)) return 'down';
  const n = Number(value);
  if (Number.isFinite(n)) {
    if (n > 0.001) return 'up';
    if (n < -0.001) return 'down';
    return 'stable';
  }
  return 'stable';
}

const TREND_ARROWS = { up: '↑', down: '↓', stable: '→' };

function humanizeKey(key) {
  const labels = {
    heartrate: 'Frecuencia cardíaca',
    heart_rate: 'Frecuencia cardíaca',
    hr: 'Frecuencia cardíaca',
    oxygen: 'SpO₂',
    spo2: 'SpO₂',
    activity: 'Actividad',
  };
  if (labels[key]) return labels[key];
  return key
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const trendEntries = computed(() => {
  const trends = mlStore.trends || {};
  return Object.entries(trends).map(([key, value]) => {
    const state = trendState(value);
    return {
      label: humanizeKey(String(key).toLowerCase()),
      raw: String(value ?? ''),
      state,
      arrow: TREND_ARROWS[state],
    };
  });
});

function patternText(p) {
  if (typeof p === 'string') return p;
  if (!p) return 'Patrón detectado';
  const text = p.description ?? p.pattern ?? p.name ?? p.label ?? String(p);
  return typeof p === 'object' && 'confidence' in p && Number.isFinite(Number(p.confidence))
    ? `${text} (${Math.round(Number(p.confidence) * 100)}%)`
    : text;
}

const normalizedPatterns = computed(() => mlStore.patterns.map(patternText).filter(Boolean));

const METRIC_INFO = {
  heartrate: { label: 'Frecuencia cardíaca', unit: 'bpm', article: 'anómala' },
  heart_rate: { label: 'Frecuencia cardíaca', unit: 'bpm', article: 'anómala' },
  hr: { label: 'Frecuencia cardíaca', unit: 'bpm', article: 'anómala' },
  oxygen: { label: 'Oxígeno en sangre', unit: '%', article: 'anómalo' },
  spo2: { label: 'Oxígeno en sangre', unit: '%', article: 'anómalo' },
  spo_2: { label: 'Oxígeno en sangre', unit: '%', article: 'anómalo' },
  o2: { label: 'Oxígeno en sangre', unit: '%', article: 'anómalo' },
  activity: { label: 'Actividad', unit: '', article: 'anómala' },
};

function metricInfo(metric) {
  if (metric === null || metric === undefined || metric === '') return null;
  const key = String(metric).toLowerCase();
  const known = METRIC_INFO[key];
  if (known) return known;
  return {
    label: key.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    unit: '',
    article: 'anómalo',
  };
}

function formatAnomalyDate(value) {
  if (value === null || value === undefined || value === '') return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatValue(value, unit) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  const text = Number.isInteger(n) ? String(n) : String(parseFloat(n.toFixed(2)));
  return unit ? `${text} ${unit}` : text;
}

function severityInfo(value) {
  if (value === null || value === undefined || value === '') return null;
  const s = String(value).toLowerCase();
  if (['high', 'critical', 'alto', 'alta', 'critic', 'severe', 'critica', '3'].includes(s)) {
    return { label: 'Alta', class: 'sev-high' };
  }
  if (['medium', 'moderate', 'medio', 'media', '2'].includes(s)) {
    return { label: 'Media', class: 'sev-mid' };
  }
  if (['low', 'baja', 'bajo', 'minor', '1'].includes(s)) {
    return { label: 'Baja', class: 'sev-low' };
  }
  return { label: String(value), class: 'sev-mid' };
}

// Explicación basada ÚNICAMENTE en los datos disponibles. Nunca afirma un
// diagnóstico médico; usa lenguaje de desviación estadística ("fuera del patrón
// habitual", "detectado como anomalía por el modelo", "desviación significativa").
function buildExplanation(a, info, valueText) {
  if (a.reason && typeof a.reason === 'string' && a.reason.trim()) {
    return a.reason.trim();
  }
  const label = info?.label ?? 'la lectura';
  if (a.deviation && info && valueText) {
    const direction = a.deviation.z > 0 ? 'por encima' : 'por debajo';
    const meanText = formatValue(a.deviation.mean, info.unit);
    return `El valor de ${label} (${valueText}) se encuentra ${direction} del patrón habitual observado en las lecturas utilizadas para el análisis${
      meanText ? ` (promedio ${meanText})` : ''
    }. Fue detectado como anomalía por el modelo.`;
  }
  if (info && valueText) {
    return `El valor de ${label} (${valueText}) presenta una desviación significativa respecto al patrón habitual detectado en las lecturas utilizadas para el análisis. Fue detectado como anomalía por el modelo.`;
  }
  return 'Esta lectura fue detectada como anomalía por el modelo: sus valores se encuentran fuera del patrón habitual de las lecturas utilizadas para el análisis.';
}

function anomalyCard(a) {
  if (!a) return null;

  if (a.source === 'string') {
    return {
      title: '⚠️ Lectura anómala detectada',
      valueText: null,
      dateText: null,
      explanation: a.text || 'Esta lectura fue detectada como anomalía por el modelo.',
      severity: null,
      severityClass: '',
      metaChips: [],
    };
  }

  const metric = a.metric ?? a.deviation?.metric ?? null;
  const info = metricInfo(metric);
  const value = a.value ?? a.deviation?.value ?? a.reading?.[metric] ?? null;
  const valueText = formatValue(value, info?.unit ?? '');
  const dateText = formatAnomalyDate(a.timestamp ?? a.reading?.timestamp);
  const title = info && metric
    ? `⚠️ ${info.label} ${info.article}`
    : '⚠️ Lectura anómala detectada';

  const sev = severityInfo(a.severity);

  const chips = [];
  if (a.zScore !== null && a.zScore !== undefined) {
    chips.push({ text: `Z-score: ${Number(a.zScore).toFixed(2)}`, class: 'chip-z', title: 'Z-score proporcionado por el modelo' });
  } else if (a.deviation?.z != null) {
    chips.push({ text: `Z-score calculado: ${Number(a.deviation.z).toFixed(2)}`, class: 'chip-z', title: 'Desviación estándar calculada respecto a la ventana de análisis' });
  }
  if (a.anomalyScore !== null && a.anomalyScore !== undefined) {
    chips.push({ text: `Score del modelo: ${Number(a.anomalyScore).toFixed(2)}`, class: 'chip-score', title: 'Puntuación de anomalía devuelta por el modelo' });
  }

  return {
    title,
    valueText,
    dateText,
    explanation: buildExplanation(a, info, valueText),
    severity: sev?.label ?? null,
    severityClass: sev?.class ?? '',
    metaChips: chips,
  };
}

const normalizedAnomalies = computed(() => mlStore.anomalies.map(anomalyCard).filter(Boolean));

function predictionText(p) {
  if (typeof p === 'string' || typeof p === 'number') return String(p);
  if (!p || typeof p !== 'object') return 'Predicción';
  const parts = Object.entries(p).filter(([k]) => k !== 'timestamp' || p[k]);
  const readable = parts.map(([k, v]) => `${humanizeKey(String(k).toLowerCase())}: ${v}`).join(' · ');
  return readable || 'Predicción';
}

const normalizedPredictions = computed(() => mlStore.predictions.map(predictionText));

function formatTime(date) {
  return new Date(date).toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const riskState = computed(() => {
  const level = String(mlStore.riskLevel || '').toLowerCase();
  const pct = clampScore(mlStore.riskScore);
  if (/low|normal|bajo|estable|stable|moderate|moderado|medio|medium/.test(level)) {
    if (/moderate|moderado|medio|medium/.test(level)) return 'risk-mid';
    return 'risk-low';
  }
  if (/high|critical|alto|critic|severe|riesgo/.test(level) || pct >= 0.67) return 'risk-high';
  if (pct >= 0.34) return 'risk-mid';
  return 'risk-low';
});

const GAUGE_CX = 100;
const GAUGE_CY = 100;
const GAUGE_R = 82;

function gaugePoint(pct) {
  const theta = Math.PI * (1 - pct);
  return {
    x: GAUGE_CX + GAUGE_R * Math.cos(theta),
    y: GAUGE_CY - GAUGE_R * Math.sin(theta),
  };
}

const gaugePct = computed(() => {
  const score = mlStore.riskScore;
  if (score === null || score === undefined) return 0;
  const pct = clampScore(score);
  return Math.max(0, Math.min(1, pct));
});

const gaugeArc = computed(() => {
  if (gaugePct.value <= 0) return '';
  const p = gaugePoint(gaugePct.value);
  return `M ${GAUGE_CX - GAUGE_R} ${GAUGE_CY} A ${GAUGE_R} ${GAUGE_R} 0 0 1 ${p.x} ${p.y}`;
});

const needle = computed(() => {
  const p = gaugePoint(gaugePct.value);
  const dx = p.x - GAUGE_CX;
  const dy = GAUGE_CY - p.y;
  return {
    x1: GAUGE_CX - dx * 0.08,
    y1: GAUGE_CY + dy * 0.08,
    x2: GAUGE_CX + dx * 0.8,
    y2: GAUGE_CY - dy * 0.8,
  };
});

const statusText = computed(() => {
  if (mlStore.analyzing) return 'Analizando…';
  if (mlStore.serviceDown) return 'IA no disponible';
  if (mlStore.analysisError) return 'Error';
  if (mlStore.insufficientData) return 'Insuficiente';
  if (mlStore.hasAnalysis) return 'Actualizado';
  if (!hasReadings.value) return 'Esperando';
  return 'En espera';
});

const statusClass = computed(() => {
  if (mlStore.analyzing) return 'status-loading';
  if (mlStore.serviceDown || mlStore.analysisError) return 'status-error';
  if (mlStore.hasAnalysis) return 'status-ok';
  return 'status-idle';
});
</script>

<style scoped>
.ai-panel {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
  padding: 20px;
  margin-top: 28px;
}

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.panel-heading {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #f5f3ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.heading-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.panel-status {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.status-loading {
  color: #d97706;
}

.status-ok {
  color: #16a34a;
}

.status-error {
  color: #dc2626;
}

.status-idle {
  color: #9ca3af;
}

.updated-at {
  font-size: 12px;
  color: #9ca3af;
}

.state-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 32px 16px;
  text-align: center;
}

.state-icon {
  font-size: 28px;
  line-height: 1;
  margin-bottom: 4px;
}

.state-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.state-desc {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
  max-width: 360px;
}

.spinner {
  width: 26px;
  height: 26px;
  border: 3px solid #e5e7eb;
  border-top-color: #7c3aed;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 6px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  color: #b91c1c;
  font-size: 13px;
  flex-wrap: wrap;
}

.error-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.error-text strong {
  font-weight: 600;
}

.retry-btn {
  flex-shrink: 0;
  padding: 6px 16px;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  background: #ffffff;
  color: #b91c1c;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.retry-btn:hover {
  background: #fecaca;
}

.risk-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 8px 0 20px;
}

.gauge {
  width: 220px;
  max-width: 100%;
  height: auto;
  flex-shrink: 0;
}

.gauge-track {
  fill: none;
  stroke: #f3f4f6;
  stroke-width: 14;
  stroke-linecap: round;
}

.gauge-arc {
  fill: none;
  stroke-width: 14;
  stroke-linecap: round;
  transition: stroke 0.3s;
}

.gauge-arc.risk-low,
.gauge-needle.risk-low {
  stroke: #22c55e;
}

.gauge-arc.risk-mid,
.gauge-needle.risk-mid {
  stroke: #f59e0b;
}

.gauge-arc.risk-high,
.gauge-needle.risk-high {
  stroke: #ef4444;
}

.gauge-needle {
  stroke-width: 3;
  stroke-linecap: round;
}

.gauge-pivot {
  fill: #111827;
}

.risk-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  min-width: 0;
}

.risk-label {
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.risk-value {
  font-size: 30px;
  font-weight: 700;
  color: #111827;
  letter-spacing: -0.5px;
  line-height: 1.1;
}

.risk-level {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 999px;
}

.risk-recommendation {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
  max-width: 100%;
  word-break: break-word;
}

.model-version {
  font-size: 10px;
  color: #9ca3af;
  opacity: 0.7;
}

.risk-level.risk-low {
  color: #15803d;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
}

.risk-level.risk-mid {
  color: #b45309;
  background: #fffbeb;
  border: 1px solid #fde68a;
}

.risk-level.risk-high {
  color: #b91c1c;
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.block {
  border-top: 1px solid #f3f4f6;
  padding-top: 16px;
  margin-top: 16px;
}

.block-title {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 10px;
}

.trend-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.trend-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #f9fafb;
  border-radius: 10px;
  min-width: 0;
}

.trend-arrow {
  font-size: 16px;
  line-height: 1;
  flex-shrink: 0;
}

.trend-arrow.up {
  color: #22c55e;
}

.trend-arrow.down {
  color: #ef4444;
}

.trend-arrow.stable {
  color: #9ca3af;
}

.trend-label {
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  font-size: 12px;
  font-weight: 500;
  color: #6d28d9;
  background: #f5f3ff;
  border: 1px solid #ddd6fe;
  border-radius: 999px;
  padding: 4px 12px;
  white-space: nowrap;
}

.anomaly-list,
.pred-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pred-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  background: #f9fafb;
  border-radius: 10px;
  font-size: 13px;
  color: #374151;
  min-width: 0;
}

.anomaly-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px;
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-left: 3px solid #f59e0b;
  border-radius: 10px;
  min-width: 0;
}

.anomaly-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.anomaly-name {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  overflow-wrap: anywhere;
}

.severity-badge {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 999px;
}

.severity-badge.sev-high {
  color: #b91c1c;
  background: #fef2f2;
  border: 1px solid #fecaca;
}

.severity-badge.sev-mid {
  color: #b45309;
  background: #fffbeb;
  border: 1px solid #fde68a;
}

.severity-badge.sev-low {
  color: #15803d;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
}

.anomaly-meta {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 13px;
}

.meta-row dt {
  color: #6b7280;
  min-width: 48px;
  flex-shrink: 0;
}

.meta-row dd {
  margin: 0;
  color: #111827;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.anomaly-why {
  background: #ffffff;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  padding: 10px 12px;
}

.why-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  color: #9ca3af;
  margin-bottom: 4px;
}

.why-text {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: #374151;
  overflow-wrap: anywhere;
}

.anomaly-meta-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
  border-radius: 999px;
  padding: 2px 10px;
}

.chip-z {
  color: #b45309;
  background: #fffbeb;
  border: 1px solid #fde68a;
}

.chip-score {
  color: #6d28d9;
  background: #f5f3ff;
  border: 1px solid #ddd6fe;
}

:global(:root.theme-dark) .ai-panel {
  background: #1e293b;
  border-color: #334155;
}

:global(:root.theme-dark) .panel-title {
  color: #f1f5f9;
}

:global(:root.theme-dark) .ai-icon {
  background: #3b3054;
}

:global(:root.theme-dark) .state-title {
  color: #f1f5f9;
}

:global(:root.theme-dark) .state-desc {
  color: #94a3b8;
}

:global(:root.theme-dark) .risk-recommendation {
  color: #94a3b8;
}

:global(:root.theme-dark) .risk-value {
  color: #f1f5f9;
}

:global(:root.theme-dark) .gauge-track {
  stroke: #334155;
}

:global(:root.theme-dark) .gauge-pivot {
  fill: #f1f5f9;
}

:global(:root.theme-dark) .block {
  border-color: #334155;
}

:global(:root.theme-dark) .block-title {
  color: #f1f5f9;
}

:global(:root.theme-dark) .trend-chip,
:global(:root.theme-dark) .anomaly-card,
:global(:root.theme-dark) .pred-item {
  background: #0f172a;
}

:global(:root.theme-dark) .anomaly-card {
  border-color: #334155;
  border-left-color: #d97706;
}

:global(:root.theme-dark) .trend-label,
:global(:root.theme-dark) .anomaly-name,
:global(:root.theme-dark) .pred-item {
  color: #e2e8f0;
}

:global(:root.theme-dark) .anomaly-why {
  background: #1e293b;
  border-color: #334155;
}

:global(:root.theme-dark) .why-text {
  color: #cbd5e1;
}

:global(:root.theme-dark) .meta-row dt {
  color: #94a3b8;
}

:global(:root.theme-dark) .meta-row dd {
  color: #f1f5f9;
}

:global(:root.theme-dark) .chip-score {
  color: #c4b5fd;
  background: #312e81;
  border-color: #4c1d95;
}

:global(:root.theme-dark) .updated-at {
  color: #64748b;
}

@media (max-width: 767px) {
  .ai-panel {
    margin-top: 20px;
    padding: 16px;
  }

  .risk-row {
    flex-direction: column;
    gap: 12px;
  }

  .gauge {
    width: 200px;
  }

  .risk-meta {
    align-items: center;
  }

  .trend-grid {
    grid-template-columns: 1fr;
  }
}
</style>