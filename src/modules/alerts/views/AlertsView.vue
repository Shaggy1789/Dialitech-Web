<template>
  <div class="alerts-view">
    <AlertsHeader />

    <AlertsToolbar />

    <AlertsList :alerts="alerts" />
  </div>
</template>

<script setup>
import { alerts } from '../data/alerts.js';
import AlertsHeader from '../components/AlertsHeader.vue';
import AlertsToolbar from '../components/AlertsToolbar.vue';
import AlertsList from '../components/AlertsList.vue';
</script>

<style scoped>
.alerts-view {
  padding: 32px;
  background: #f8f9fa;
  flex: 1;
}
</style>
