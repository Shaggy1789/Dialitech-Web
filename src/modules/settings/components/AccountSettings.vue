<template>
  <SettingsSection title="Account" description="View your account information and status">
    <div class="account-grid">
      <div class="account-row">
        <span class="account-label">Username</span>
        <span class="account-value">{{ settings.account.username }}</span>
      </div>
      <div class="account-row">
        <span class="account-label">Email</span>
        <span class="account-value">{{ settings.account.email }}</span>
      </div>
      <div class="account-row">
        <span class="account-label">Role</span>
        <span class="account-value">
          <RoleBadge role="Administrator" />
        </span>
      </div>
      <div class="account-row">
        <span class="account-label">Status</span>
        <span class="account-value">
          <UserStatusBadge status="Active" />
        </span>
      </div>
    </div>
  </SettingsSection>
</template>

<script setup>
import { settings } from '../data/settings.js';
import SettingsSection from './SettingsSection.vue';
import RoleBadge from '../../user-management/components/RoleBadge.vue';
import UserStatusBadge from '../../user-management/components/UserStatusBadge.vue';
</script>

<style scoped>
.account-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.account-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: #f9fafb;
  border-radius: 10px;
}

.account-label {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  min-width: 100px;
  flex-shrink: 0;
}

.account-value {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}
</style>
