<template>
  <div class="history-card">
    <h3 class="history-title">Recent Session History</h3>
    <div class="table-wrapper">
      <table class="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Session Type</th>
            <th>Observations</th>
            <th>Doctor</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in history" :key="index" class="history-row">
            <td class="cell-date">{{ record.date }}</td>
            <td class="cell-type">{{ record.type }}</td>
            <td class="cell-obs">{{ record.observations }}</td>
            <td class="cell-doctor">{{ record.doctor }}</td>
            <td class="cell-status">
              <StatusBadge :status="record.status" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import StatusBadge from '../../../../components/StatusBadge.vue';

defineProps({
  history: { type: Array, required: true },
});
</script>

<style scoped>
.history-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
  padding: 20px 24px;
}

.history-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.table-wrapper {
  overflow-x: auto;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
}

.history-table thead {
  background: #f9fafb;
}

.history-table th {
  padding: 10px 16px;
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: left;
  white-space: nowrap;
  border-bottom: 1px solid #e5e7eb;
}

.history-row:not(:last-child) td {
  border-bottom: 1px solid #f3f4f6;
}

.history-row:hover {
  background: #f9fafb;
}

.history-row td {
  padding: 12px 16px;
  font-size: 14px;
  color: #374151;
}

.cell-date {
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
}

.cell-type {
  font-weight: 500;
}

.cell-obs {
  color: #6b7280;
  max-width: 280px;
}

.cell-doctor {
  white-space: nowrap;
}
</style>
