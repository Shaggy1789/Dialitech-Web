<template>
  <section class="alerts-panel">
    <div class="panel-header">
      <h2 class="panel-title">Critical Alerts</h2>
      <button class="view-all-btn">View All</button>
    </div>
    <div class="alerts-list">
      <CriticalAlertCard
        v-for="alert in alerts"
        :key="alert.id"
        :patient="alert.patient"
        :type="alert.type"
        :time="alert.time"
        :status="alert.status"
      />
    </div>
  </section>
</template>

<script setup>
import CriticalAlertCard from './CriticalAlertCard.vue';

const alerts = [
  {
    id: 1,
    patient: 'Robert Johnson',
    type: 'Kidney Function Decline',
    time: 'Today, 10:45 AM',
    status: 'Critical',
  },
  {
    id: 2,
    patient: 'Emily Davis',
    type: 'High Potassium Levels',
    time: 'Today, 09:15 AM',
    status: 'Warning',
  },
  {
    id: 3,
    patient: 'Michael Brown',
    type: 'Missed Dialysis Session',
    time: 'Today, 08:30 AM',
    status: 'Critical',
  },
  {
    id: 4,
    patient: 'Linda Williams',
    type: 'Rapid Weight Gain',
    time: 'Yesterday, 07:10 PM',
    status: 'Warning',
  },
  {
    id: 5,
    patient: 'Thomas Garcia',
    type: 'Low Hemoglobin',
    time: 'Yesterday, 03:45 PM',
    status: 'Critical',
  },
];
</script>

<style scoped>
.alerts-panel {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
  overflow: hidden;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px 0;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.view-all-btn {
  background: none;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.view-all-btn:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.alerts-list {
  padding: 12px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>