<template>
  <tr class="user-row">
    <td class="cell-user">
      <div class="user-info">
        <div class="avatar" :style="{ background: avatarColor }">
          {{ initials }}
        </div>
        <div class="user-details">
          <span class="user-name">{{ user.name }}</span>
          <span class="user-email">{{ user.email }}</span>
        </div>
      </div>
    </td>
    <td class="cell-role">
      <RoleBadge :role="user.role" />
    </td>
    <td class="cell-data">{{ user.department }}</td>
    <td class="cell-data">{{ user.lastAccess }}</td>
    <td class="cell-status">
      <UserStatusBadge :status="user.status" />
    </td>
    <td class="cell-actions">
      <UserActions />
    </td>
  </tr>
</template>

<script setup>
import { computed } from 'vue';
import RoleBadge from './RoleBadge.vue';
import UserStatusBadge from './UserStatusBadge.vue';
import UserActions from './UserActions.vue';

const props = defineProps({
  user: { type: Object, required: true },
});

const avatarColors = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2', '#db2777', '#4f46e5', '#16a34a', '#9333ea', '#e11d48', '#0d9488'];
const initials = computed(() =>
  props.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
);
const avatarColor = computed(() =>
  avatarColors[props.user.id % avatarColors.length]
);
</script>

<style scoped>
.user-row {
  transition: background 0.15s;
}

.user-row:hover {
  background: #f9fafb;
}

.user-row:not(:last-child) td {
  border-bottom: 1px solid #f3f4f6;
}

.cell-user {
  padding: 12px 16px 12px 24px;
}

.user-info {
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

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.user-email {
  font-size: 12px;
  color: #9ca3af;
}

.cell-role {
  padding: 12px 16px;
}

.cell-data {
  padding: 12px 16px;
  font-size: 14px;
  color: #374151;
  white-space: nowrap;
}

.cell-status {
  padding: 12px 16px;
}

.cell-actions {
  padding: 12px 24px 12px 16px;
}
</style>
