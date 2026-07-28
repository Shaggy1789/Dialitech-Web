<template>
  <SettingsSection title="General Settings" description="Configure basic application information">
    <div class="settings-form">
      <div class="form-row">
        <label class="form-label">Application Name</label>
        <input class="form-input" :value="settings.general.appName" readonly />
      </div>
      <div class="form-row">
        <label class="form-label">Organization Name</label>
        <input class="form-input" :value="settings.general.orgName" readonly />
      </div>
      <div class="form-row">
        <label class="form-label">Time Zone</label>
        <select class="form-select">
          <option v-for="tz in timeZones" :key="tz" :selected="tz === settings.general.timeZone">{{ tz }}</option>
        </select>
      </div>
      <div class="form-row">
        <label class="form-label">Language</label>
        <select class="form-select">
          <option v-for="lang in languages" :key="lang" :selected="lang === settings.general.language">{{ lang }}</option>
        </select>
      </div>
      <div class="form-row">
        <label class="form-label">Date Format</label>
        <select class="form-select">
          <option v-for="df in dateFormats" :key="df" :selected="df === settings.general.dateFormat">{{ df }}</option>
        </select>
      </div>
    </div>
  </SettingsSection>
</template>

<script setup>
import { settings, timeZones, languages, dateFormats } from '../data/settings.js';
import SettingsSection from './SettingsSection.vue';
</script>

<style scoped>
.settings-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.form-label {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  min-width: 140px;
  flex-shrink: 0;
}

.form-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #111827;
  background: #f9fafb;
  outline: none;
  cursor: default;
  max-width: 320px;
}

.form-select {
  flex: 1;
  padding: 8px 32px 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
  background: #ffffff;
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  max-width: 320px;
  transition: border-color 0.15s;
}

.form-select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
</style>
