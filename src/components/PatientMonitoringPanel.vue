<template>
  <section class="monitoring-panel">
    <div class="panel-header">
      <h2 class="panel-title">Active Patient Monitoring</h2>
    </div>
    <div class="patients-grid">
      <PatientMonitoringCard
        v-for="patient in patients"
        :key="patient.id"
        :name="patient.name"
        :age="patient.age"
        :status="patient.status"
        :heart-rate="patient.heartRate"
        :blood-pressure="patient.bloodPressure"
        :temperature="patient.temperature"
      />
    </div>
  </section>
</template>

<script setup>
import PatientMonitoringCard from './PatientMonitoringCard.vue';

const patients = [
  {
    id: 1,
    name: 'James Anderson',
    age: 58,
    status: 'Normal',
    heartRate: 72,
    bloodPressure: '120/80',
    temperature: 98.2,
  },
  {
    id: 2,
    name: 'Patricia Moore',
    age: 63,
    status: 'Warning',
    heartRate: 88,
    bloodPressure: '140/90',
    temperature: 99.5,
  },
  {
    id: 3,
    name: 'Richard Taylor',
    age: 55,
    status: 'Critical',
    heartRate: 96,
    bloodPressure: '150/95',
    temperature: 100.1,
  },
  {
    id: 4,
    name: 'Susan Clark',
    age: 49,
    status: 'Normal',
    heartRate: 68,
    bloodPressure: '118/75',
    temperature: 98.6,
  },
  {
    id: 5,
    name: 'Robert Smith',
    age: 67,
    status: 'Normal',
    heartRate: 74,
    bloodPressure: '122/82',
    temperature: 98.4,
  },
  {
    id: 6,
    name: 'Maria Lopez',
    age: 52,
    status: 'Warning',
    heartRate: 82,
    bloodPressure: '135/88',
    temperature: 99.1,
  },
];
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
</style>