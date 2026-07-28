<template>
  <SettingsSection title="Security" description="Manage your security and authentication settings">
    <div class="security-list">
      <div class="security-row">
        <div class="security-info">
          <span class="security-label">Change Password</span>
          <span class="security-desc">Update your current password</span>
        </div>
        <button class="action-btn">Change</button>
      </div>
      <div class="security-row">
        <div class="security-info">
          <span class="security-label">Two-Factor Authentication</span>
          <span class="security-desc">Add an extra layer of security</span>
        </div>
        <label class="toggle" :class="{ active: settings.security.twoFactorAuth }">
          <input type="checkbox" checked disabled />
          <span class="toggle-slider" />
        </label>
      </div>
      <div class="security-row">
        <div class="security-info">
          <span class="security-label">Session Timeout</span>
          <span class="security-desc">Auto logout after inactivity</span>
        </div>
        <select class="field-select">
          <option v-for="t in sessionTimeouts" :key="t" :selected="t === settings.security.sessionTimeout">{{ t }}</option>
        </select>
      </div>
      <div class="security-row">
        <div class="security-info">
          <span class="security-label">Automatic Logout</span>
          <span class="security-desc">Log out automatically on browser close</span>
        </div>
        <label class="toggle" :class="{ active: settings.security.autoLogout }">
          <input type="checkbox" disabled />
          <span class="toggle-slider" />
        </label>
      </div>
    </div>
  </SettingsSection>
</template>

<script setup>
import { settings, sessionTimeouts } from '../data/settings.js';
import SettingsSection from './SettingsSection.vue';
</script>

<style scoped>
.security-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.security-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}

.security-row:last-child {
  border-bottom: none;
}

.security-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.security-label {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.security-desc {
  font-size: 12px;
  color: #9ca3af;
}

.action-btn {
  padding: 6px 16px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.action-btn:hover {
  background: #e5e7eb;
}

.toggle {
  position: relative;
  width: 44px;
  height: 24px;
  background: #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;
}

.toggle.active {
  background: #2563eb;
}

.toggle input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: #ffffff;
  border-radius: 50%;
  transition: transform 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.toggle.active .toggle-slider {
  transform: translateX(20px);
}

.field-select {
  padding: 6px 28px 6px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  color: #374151;
  background: #ffffff;
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  min-width: 130px;
}
</style>
