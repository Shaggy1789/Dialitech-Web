<template>
  <tr class="table-row">
    <td class="cell-patient">
      <div class="patient-info">
        <div class="avatar" :style="{ background: avatarColor }">
          {{ initials }}
        </div>
        <router-link class="patient-name" :to="`/patients/${patient.id}`">{{ patient.name }}</router-link>
      </div>
    </td>
    <td class="cell-data">{{ patient.age }}</td>
    <td class="cell-data">{{ patient.gender }}</td>
    <td class="cell-data">{{ patient.doctor }}</td>
    <td class="cell-data">{{ patient.lastSession }}</td>
    <td class="cell-data">{{ patient.nextSession }}</td>
    <td class="cell-status">
      <StatusBadge :status="patient.status" />
    </td>
    <td class="cell-actions">
      <PatientActions :patient-id="patient.id" />
    </td>
  </tr>
</template>

<script setup>
import { computed } from 'vue';
import StatusBadge from '../../../components/StatusBadge.vue';
import PatientActions from './PatientActions.vue';

const props = defineProps({
  patient: { type: Object, required: true },
});

const avatarColors = ['#2563eb', '#7c3aed', '#db2777', '#dc2626', '#d97706', '#059669', '#0891b2', '#4f46e5', '#9333ea', '#e11d48'];
const initials = computed(() =>
  props.patient.name.split(' ').map(n => n[0]).join('').toUpperCase()
);
const avatarColor = computed(() =>
  avatarColors[props.patient.id % avatarColors.length]
);
</script>

<style scoped>
.table-row {
  transition: background 0.15s;
}

.table-row:hover {
  background: #f9fafb;
}

.table-row:not(:last-child) .cell-patient,
.table-row:not(:last-child) .cell-data,
.table-row:not(:last-child) .cell-status,
.table-row:not(:last-child) .cell-actions {
  border-bottom: 1px solid #f3f4f6;
}

.cell-patient {
  padding: 14px 16px 14px 24px;
}

.patient-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
  flex-shrink: 0;
}

.patient-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  text-decoration: none;
  transition: color 0.15s;
}

.patient-name:hover {
  color: #2563eb;
}

.cell-data {
  padding: 14px 16px;
  font-size: 14px;
  color: #374151;
  white-space: nowrap;
}

.cell-status {
  padding: 14px 16px;
}

.cell-actions {
  padding: 14px 24px 14px 16px;
}
</style>
