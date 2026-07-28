<template>
  <div class="dashboard-view">
    <header class="page-header">
      <h1 class="page-title">Clinical Dashboard</h1>
      <p class="page-subtitle">Real-time monitoring overview</p>
    </header>
    <div class="kpi-grid">
      <StatsCard
        title="Patients Monitored"
        value="24 / 30"
        variant="blue"
      />
      <StatsCard
        title="Critical Alerts"
        value="2 Critical"
        variant="red"
      />
      <StatsCard
        title="Patients Online"
        value="100%"
        variant="green"
      />
      <StatsCard
        title="System Status"
        value="Stable"
        variant="blue"
      />
    </div>
    <div class="dashboard-grid">
      <CriticalAlertsPanel />
      <PatientMonitoringPanel />
    </div>
  </div>
</template>

<script setup>
import StatsCard from '../components/StatsCard.vue';
import CriticalAlertsPanel from '../components/CriticalAlertsPanel.vue';
import PatientMonitoringPanel from '../components/PatientMonitoringPanel.vue';
</script>

<style scoped>
.dashboard-view {
  padding: 32px;
  background: #f8f9fa;
  flex: 1;
}

.page-header {
  margin-bottom: 28px;
}

.page-title {
  font-size: 26px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px 0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 28px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  align-items: start;
}
</style>