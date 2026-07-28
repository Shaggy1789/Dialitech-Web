<template>
  <SettingsSection title="Subscription / Plan" description="View and manage your current subscription plan">
    <div class="subscription-layout">
      <div class="plan-badge" :class="planClass">{{ settings.subscription.plan }}</div>
      <div class="subscription-details">
        <div class="sub-row">
          <span class="sub-label">Current Plan</span>
          <span class="sub-value">{{ settings.subscription.plan }}</span>
        </div>
        <div class="sub-row">
          <span class="sub-label">Price</span>
          <span class="sub-value price">{{ settings.subscription.price }}</span>
        </div>
        <div class="sub-row">
          <span class="sub-label">Renewal Date</span>
          <span class="sub-value">{{ settings.subscription.renewalDate }}</span>
        </div>
      </div>
      <div class="benefits-section">
        <h4 class="benefits-title">Plan Benefits</h4>
        <ul class="benefits-list">
          <li v-for="(benefit, idx) in settings.subscription.benefits" :key="idx" class="benefit-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 8.5L6.5 11L12 5" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            {{ benefit }}
          </li>
        </ul>
      </div>
      <button class="upgrade-btn">Upgrade Plan</button>
    </div>
  </SettingsSection>
</template>

<script setup>
import { computed } from 'vue';
import { settings } from '../data/settings.js';
import SettingsSection from './SettingsSection.vue';

const planClass = computed(() => {
  const p = settings.subscription.plan.toLowerCase();
  if (p === 'enterprise') return 'enterprise';
  if (p === 'professional') return 'professional';
  return 'basic';
});
</script>

<style scoped>
.subscription-layout {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.plan-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
}

.plan-badge.enterprise {
  background: #fef3c7;
  color: #d97706;
}

.plan-badge.professional {
  background: #dbeafe;
  color: #2563eb;
}

.plan-badge.basic {
  background: #e5e7eb;
  color: #6b7280;
}

.subscription-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sub-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 16px;
  background: #f9fafb;
  border-radius: 10px;
}

.sub-label {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  min-width: 110px;
  flex-shrink: 0;
}

.sub-value {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.sub-value.price {
  color: #059669;
  font-size: 16px;
}

.benefits-section {
  background: #f9fafb;
  border-radius: 10px;
  padding: 16px 20px;
}

.benefits-title {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 12px 0;
}

.benefits-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #374151;
}

.upgrade-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 28px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
  width: fit-content;
}

.upgrade-btn:hover {
  opacity: 0.9;
}
</style>
