<template>
  <div class="patient-card">
    <div class="card-top">
      <strong class="patient-name">{{ name }}</strong>
      <StatusBadge :status="status" />
    </div>
    <p class="patient-age">Age: {{ age }}</p>
    <div class="vitals-grid">
      <div class="vital-row">
        <svg class="vital-icon hr-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 8h2l1.5-4.5L7 12.5l1.5-7L10 8h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span class="vital-label">Heart Rate</span>
        <span class="vital-value">{{ heartRate }} bpm</span>
      </div>
      <div class="vital-row">
        <svg class="vital-icon bp-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="2" width="12" height="4" rx="1" stroke="currentColor" stroke-width="1.5" />
          <rect x="5" y="7" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5" />
        </svg>
        <span class="vital-label">Blood Pressure</span>
        <span class="vital-value">{{ bloodPressure }}</span>
      </div>
      <div class="vital-row">
        <svg class="vital-icon temp-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2v7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          <circle cx="8" cy="12" r="2.5" stroke="currentColor" stroke-width="1.5" />
          <path d="M8 9.5L8 2" stroke="currentColor" stroke-width="1.5" />
          <path d="M5.5 5.5L10.5 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        <span class="vital-label">Temperature</span>
        <span class="vital-value">{{ temperature }}°F</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import StatusBadge from './StatusBadge.vue';

defineProps({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  status: { type: String, required: true },
  heartRate: { type: Number, required: true },
  bloodPressure: { type: String, required: true },
  temperature: { type: Number, required: true },
});
</script>

<style scoped>
.patient-card {
  background: #ffffff;
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  padding: 16px 18px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: box-shadow 0.15s;
}

.patient-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.patient-name {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.patient-age {
  font-size: 13px;
  color: #9ca3af;
  margin-bottom: 14px;
}

.vitals-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.vital-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.vital-icon {
  flex-shrink: 0;
}

.hr-icon {
  color: #ef4444;
}

.bp-icon {
  color: #2563eb;
}

.temp-icon {
  color: #f59e0b;
}

.vital-label {
  font-size: 13px;
  color: #6b7280;
}

.vital-value {
  margin-left: auto;
  font-size: 13px;
  font-weight: 600;
  color: #111827;
}
</style>