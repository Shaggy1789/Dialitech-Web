<template>
  <div class="table-card">
    <div class="table-wrapper">
      <table class="users-table">
        <thead>
          <tr>
            <th class="th-user">User</th>
            <th class="th-role">Role</th>
            <th class="th-data">Department</th>
            <th class="th-data">Last Access</th>
            <th class="th-status">Status</th>
            <th class="th-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <UserRow v-for="user in users" :key="user.id" :user="user" />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import UserRow from './UserRow.vue';

defineProps({
  users: { type: Array, required: true },
});
</script>

<style scoped>
.table-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
  overflow: hidden;
}

.table-wrapper {
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
}

.users-table thead {
  background: #f9fafb;
}

.users-table th {
  padding: 12px 16px;
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: left;
  white-space: nowrap;
  border-bottom: 1px solid #e5e7eb;
}

.th-user {
  padding-left: 24px !important;
}

.th-actions {
  padding-right: 24px !important;
}
</style>
