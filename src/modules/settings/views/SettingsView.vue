<template>
  <div class="settings-view">
    <SettingsHeader />

    <div class="settings-layout">
      <SettingsSidebar :activeSection="activeSection" @select="activeSection = $event" />

      <div class="settings-content">
        <ProfileSettings v-if="activeSection === 'profile'" />
        <AccountSettings v-if="activeSection === 'account'" />
        <NotificationSettingsCard v-if="activeSection === 'notifications'" />
        <SecuritySettingsCard v-if="activeSection === 'security'" />
        <AppearanceSettingsCard v-if="activeSection === 'appearance'" />
        <SubscriptionSettings v-if="activeSection === 'subscription'" />
        <SystemInformationCard v-if="activeSection === 'system'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SettingsHeader from '../components/SettingsHeader.vue';
import SettingsSidebar from '../components/SettingsSidebar.vue';
import ProfileSettings from '../components/ProfileSettings.vue';
import AccountSettings from '../components/AccountSettings.vue';
import NotificationSettingsCard from '../components/NotificationSettingsCard.vue';
import SecuritySettingsCard from '../components/SecuritySettingsCard.vue';
import AppearanceSettingsCard from '../components/AppearanceSettingsCard.vue';
import SubscriptionSettings from '../components/SubscriptionSettings.vue';
import SystemInformationCard from '../components/SystemInformationCard.vue';

const activeSection = ref('profile');
</script>

<style scoped>
.settings-view {
  padding: 32px;
  background: #f8f9fa;
  flex: 1;
}

.settings-layout {
  display: flex;
  gap: 28px;
  align-items: flex-start;
}

.settings-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
