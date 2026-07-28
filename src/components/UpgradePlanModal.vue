<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-card">
        <button class="close-btn" @click="$emit('close')">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 5L15 15M15 5L5 15" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </button>

        <div class="modal-header">
          <span class="lock-icon-large">🔒</span>
          <h2 class="modal-title">Feature Locked</h2>
          <p class="modal-desc">This feature is available in a higher subscription plan. Upgrade to unlock it.</p>
        </div>

        <div class="plans-comparison">
          <div
            v-for="plan in upgradePlans"
            :key="plan.id"
            class="plan-card"
            :class="{ featured: plan.featured }"
          >
            <div v-if="plan.featured" class="popular-badge">Most Popular</div>
            <h3 class="plan-name">{{ plan.name }}</h3>
            <div class="plan-price">
              <span class="price">${{ plan.price }}</span>
              <span class="period">{{ plan.period }}</span>
            </div>
            <ul class="plan-features">
              <li v-for="(feat, i) in plan.features" :key="i" class="feature-item">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7.5L5.5 10L11 4" stroke="#22c55e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                {{ feat }}
              </li>
            </ul>
            <button class="select-plan-btn" @click="$emit('select', plan.id)">
              Choose {{ plan.name }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue';
import { PLANS } from '../config/plans';

const props = defineProps({
  visible: { type: Boolean, default: false },
  currentPlan: { type: String, default: 'free' },
});

defineEmits(['close', 'select']);

const upgradePlans = computed(() => {
  const order = ['basic', 'professional', 'enterprise'];
  const currentIndex = order.indexOf(props.currentPlan);
  return order.slice(currentIndex >= 0 ? currentIndex : 0).map((id) => PLANS[id]).filter(Boolean);
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.modal-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 36px;
  max-width: 720px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
}

.close-btn:hover {
  background: #e5e7eb;
}

.modal-header {
  text-align: center;
  margin-bottom: 28px;
}

.lock-icon-large {
  font-size: 40px;
  display: block;
  margin-bottom: 12px;
}

.modal-title {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px;
}

.modal-desc {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.plans-comparison {
  display: flex;
  gap: 16px;
}

.plan-card {
  flex: 1;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  transition: border-color 0.2s;
}

.plan-card.featured {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.popular-badge {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: #2563eb;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 12px;
  border-radius: 6px;
  white-space: nowrap;
}

.plan-name {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px;
}

.plan-price {
  margin-bottom: 16px;
}

.price {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
}

.period {
  font-size: 13px;
  color: #6b7280;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #374151;
}

.select-plan-btn {
  padding: 10px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}

.select-plan-btn:hover {
  background: #1d4ed8;
}
</style>
