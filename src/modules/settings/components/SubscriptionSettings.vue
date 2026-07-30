<template>
  <SettingsSection title="Subscription / Plan" description="View and manage your current subscription plan">
    <div v-if="loading" class="subscription-skeleton">
      <div class="skeleton skeleton-badge"></div>
      <div class="skeleton skeleton-row" style="width:60%"></div>
      <div class="skeleton skeleton-row" style="width:40%"></div>
      <div class="skeleton skeleton-row" style="width:50%"></div>
      <div class="skeleton skeleton-benefits"></div>
    </div>
    <div v-else-if="error" class="error-banner">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="8" stroke="#ef4444" stroke-width="1.5"/>
        <path d="M9 5.5V9.5" stroke="#ef4444" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="9" cy="12" r="0.75" fill="#ef4444"/>
      </svg>
      <span>{{ error }}</span>
      <button class="retry-btn" @click="fetch">Retry</button>
    </div>
    <div v-else-if="!hasActiveSubscription" class="no-plan-card">
      <div class="no-plan-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="6" width="18" height="14" rx="2" stroke="#9ca3af" stroke-width="1.5"/>
          <path d="M12 12V16" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round"/>
          <circle cx="12" cy="10" r="0.75" fill="#9ca3af"/>
        </svg>
      </div>
      <h4 class="no-plan-title">No Active Subscription</h4>
      <p class="no-plan-desc">You don't currently have an active plan. Subscribe to unlock all features.</p>
      <button class="view-plans-btn">View Plans</button>
    </div>
    <div v-else class="subscription-layout">
      <div class="plan-badge" :class="planClass">{{ plan.name }}</div>
      <div class="subscription-details">
        <div class="sub-row">
          <span class="sub-label">Current Plan</span>
          <span class="sub-value">{{ plan.name }}</span>
        </div>
        <div class="sub-row">
          <span class="sub-label">Price</span>
          <span class="sub-value price">{{ plan.price }}</span>
        </div>
        <div class="sub-row">
          <span class="sub-label">Status</span>
          <span class="sub-value">{{ plan.status }}</span>
        </div>
      </div>
      <div class="benefits-section">
        <h4 class="benefits-title">Plan Benefits</h4>
        <ul class="benefits-list">
          <li v-for="(benefit, idx) in plan.benefits" :key="idx" class="benefit-item">
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
import { useSubscription } from '../../../composables/useSubscription';
import SettingsSection from './SettingsSection.vue';

const { plan, loading, error, hasActiveSubscription, fetch } = useSubscription();

const planClass = computed(() => {
  if (!plan.value) return 'basic';
  const name = plan.value.name.toLowerCase();
  if (name === 'enterprise') return 'enterprise';
  if (name === 'professional') return 'professional';
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

.no-plan-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px 24px;
  background: #f9fafb;
  border-radius: 12px;
  text-align: center;
}

.no-plan-icon {
  color: #9ca3af;
}

.no-plan-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.no-plan-desc {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  max-width: 360px;
}

.view-plans-btn {
  padding: 10px 24px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.view-plans-btn:hover {
  background: #1d4ed8;
}

.subscription-skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
}

.skeleton-badge {
  width: 100px;
  height: 28px;
  border-radius: 20px;
}

.skeleton-row {
  height: 36px;
  border-radius: 10px;
}

.skeleton-benefits {
  height: 120px;
  border-radius: 10px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.error-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #fef2f2;
  border-radius: 10px;
  color: #dc2626;
  font-size: 14px;
}

.retry-btn {
  margin-left: auto;
  padding: 4px 12px;
  background: #dc2626;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.retry-btn:hover {
  background: #b91c1c;
}
</style>
