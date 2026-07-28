<template>
  <div class="alerts-view">
    <AlertsHeader />

    <AlertsToolbar />

    <AlertsList :alerts="alertStore.alerts" />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAlertStore } from '../../../stores/alertStore';
import { useAuthStore } from '../../../stores/authStore';
import AlertsHeader from '../components/AlertsHeader.vue';
import AlertsToolbar from '../components/AlertsToolbar.vue';
import AlertsList from '../components/AlertsList.vue';

const alertStore = useAlertStore();
const authStore = useAuthStore();

onMounted(() => {
  if (authStore.userId) {
    alertStore.fetchByUser(authStore.userId);
  }
});
</script>

<style scoped>
.alerts-view {
  padding: 32px;
  background: #f8f9fa;
  flex: 1;
}
</style>
