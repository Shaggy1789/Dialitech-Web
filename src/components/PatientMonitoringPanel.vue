<template>
  <section class="monitoring-panel">
    <div class="panel-header">
      <h2 class="panel-title">Active Patient Monitoring</h2>
    </div>
    <div v-if="patients.length" class="patients-grid">
      <PatientMonitoringCard
        v-for="patient in patients"
        :key="patient.id"
        :name="patient.name"
        :age="patient.age"
        :status="patient.status"
        :heart-rate="patient.heartRate"
        :oxygen="patient.oxygen"
        :activity="patient.activity"
      />
    </div>
    <div v-else class="patients-empty">
      <p>No patients registered yet</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import PatientMonitoringCard from './PatientMonitoringCard.vue';

const patients = ref([]);

onMounted(async () => {
  try {
    const { data } = await api.get('/patients');
    patients.value = (data || []).map((p) => ({
      id: p.id,
      name: p.name || '',
      age: p.age || 0,
      status: p.lastHeartRate ? 'Active' : 'Normal',
      heartRate: p.lastHeartRate || 0,
      oxygen: p.lastOxygen || 0,
      activity: p.lastActivity || 0,
    }));
  } catch {
    patients.value = [];
  }
});
</script>

<style scoped>
.monitoring-panel {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
  overflow: hidden;
}

.panel-header {
  padding: 18px 20px 0;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.patients-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 16px 20px 20px;
}

.patients-empty {
  padding: 32px 20px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
}
</style>
