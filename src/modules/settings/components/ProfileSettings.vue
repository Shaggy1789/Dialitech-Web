<template>
  <SettingsSection title="Profile" description="Manage your personal information and photo">
    <div class="profile-layout">
      <AvatarUploader />
      <div class="profile-fields">
        <div class="field-row">
          <label class="field-label">Full Name</label>
          <input class="field-input" :value="authStore.userName" readonly />
        </div>
        <div class="field-row">
          <label class="field-label">Email</label>
          <input class="field-input" :value="authStore.userEmail" readonly />
        </div>
        <div class="field-row">
          <label class="field-label">Phone</label>
          <input class="field-input" :value="authStore.user?.phone || ''" readonly />
        </div>
      </div>
    </div>
  </SettingsSection>
</template>

<script setup>
import { useAuthStore } from '../../../stores/authStore';
import SettingsSection from './SettingsSection.vue';
import AvatarUploader from './AvatarUploader.vue';

const authStore = useAuthStore();
</script>

<style scoped>
.profile-layout {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.profile-fields {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.field-label {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  min-width: 110px;
  flex-shrink: 0;
}

.field-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;
  background: #f9fafb;
  outline: none;
  cursor: default;
  max-width: 360px;
}
</style>
