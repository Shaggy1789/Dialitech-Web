<template>
  <PatientDashboardView v-if="sub.role === 'patient'" />

  <div v-else class="dashboard-view">
    <SubscriptionBanner
      :plan="sub.planId"
      @upgrade="showModal = true"
    />

    <header class="page-header">
      <h1 class="page-title">Clinical Dashboard</h1>
      <p class="page-subtitle">Real-time monitoring overview</p>
    </header>

    <div class="kpi-grid">
      <PermissionWrapper feature="dashboard" @open-modal="showModal = true">
        <StatsCard title="Patients Monitored" value="24 / 30" variant="blue" />
      </PermissionWrapper>

      <PermissionWrapper feature="alerts" @open-modal="showModal = true">
        <StatsCard title="Critical Alerts" value="2 Critical" variant="red" />
      </PermissionWrapper>

      <PermissionWrapper feature="dashboard" @open-modal="showModal = true">
        <StatsCard title="Patients Online" value="100%" variant="green" />
      </PermissionWrapper>

      <PermissionWrapper feature="statistics" @open-modal="showModal = true">
        <StatsCard title="System Status" value="Stable" variant="blue" />
      </PermissionWrapper>
    </div>

    <div class="dashboard-grid">
      <PermissionWrapper feature="alerts" @open-modal="showModal = true">
        <CriticalAlertsPanel />
      </PermissionWrapper>

      <PermissionWrapper feature="patients" @open-modal="showModal = true">
        <PatientMonitoringPanel />
      </PermissionWrapper>
    </div>

    <UpgradePlanModal
      :visible="showModal"
      :current-plan="sub.planId"
      @close="showModal = false"
      @select="onSelectPlan"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import StatsCard from '../components/StatsCard.vue';
import CriticalAlertsPanel from '../components/CriticalAlertsPanel.vue';
import PatientMonitoringPanel from '../components/PatientMonitoringPanel.vue';
import PatientDashboardView from '../components/PatientDashboardView.vue';
import SubscriptionBanner from '../components/SubscriptionBanner.vue';
import PermissionWrapper from '../components/PermissionWrapper.vue';
import UpgradePlanModal from '../components/UpgradePlanModal.vue';

const sub = useSubscriptionStore();
const showModal = ref(false);

function onSelectPlan(planId) {
  sub.setPlan(planId);
  showModal.value = false;
}
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
