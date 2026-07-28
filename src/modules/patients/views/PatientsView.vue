<template>
  <div class="patients-view">
    <PatientsHeader title="Patients" subtitle="Manage and monitor all registered patients" />

    <div class="toolbar">
      <PatientsSearchBar />
      <PatientsFilters />
    </div>

    <PatientsTable :patients="patients" />

    <div class="pagination-wrapper">
      <Pagination :total-items="patients.length" />
    </div>
  </div>
</template>

<script setup>
import { patients } from '../data/patients.js';
import PatientsHeader from '../components/PatientsHeader.vue';
import PatientsSearchBar from '../components/PatientsSearchBar.vue';
import PatientsFilters from '../components/PatientsFilters.vue';
import PatientsTable from '../components/PatientsTable.vue';
import Pagination from '../components/Pagination.vue';
</script>

<style scoped>
.patients-view {
  padding: 32px;
  background: #f8f9fa;
  flex: 1;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.pagination-wrapper {
  margin-top: 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
}
</style>
