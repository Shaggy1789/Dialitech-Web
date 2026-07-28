<template>
  <div class="alerts-card">
    <h3 class="alerts-title">Patient Alerts</h3>
    <div class="alerts-list">
      <div
        v-for="(alert, index) in alerts"
        :key="index"
        class="alert-item"
        :class="`level-${alert.level.toLowerCase()}`"
      >
        <div class="alert-icon" :class="`level-${alert.level.toLowerCase()}`">
          <svg v-if="alert.level === 'Critical'" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="8" stroke="currentColor" stroke-width="1.3" />
            <path d="M9 5V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            <circle cx="9" cy="13" r="1" fill="currentColor" />
          </svg>
          <svg v-else-if="alert.level === 'Warning'" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2L1 16H17L9 2Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" />
            <path d="M9 7V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            <circle cx="9" cy="13.5" r="1" fill="currentColor" />
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="8" stroke="currentColor" stroke-width="1.3" />
            <path d="M6 9L8 11L12 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div class="alert-content">
          <div class="alert-top">
            <span class="alert-level">{{ alert.level }}</span>
            <span class="alert-date">{{ alert.date }}</span>
          </div>
          <p class="alert-desc">{{ alert.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  alerts: { type: Array, required: true },
});
</script>

<style scoped>
.alerts-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
  padding: 20px 24px;
}

.alerts-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.alert-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  transition: background 0.15s;
}

.alert-item.level-critical {
  background: #fef2f2;
}

.alert-item.level-warning {
  background: #fffbeb;
}

.alert-item.level-normal {
  background: #f0fdf4;
}

.alert-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.alert-icon.level-critical {
  background: #fecaca;
  color: #dc2626;
}

.alert-icon.level-warning {
  background: #fde68a;
  color: #d97706;
}

.alert-icon.level-normal {
  background: #bbf7d0;
  color: #16a34a;
}

.alert-content {
  flex: 1;
  min-width: 0;
}

.alert-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.alert-level {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.level-critical .alert-level {
  color: #dc2626;
}

.level-warning .alert-level {
  color: #d97706;
}

.level-normal .alert-level {
  color: #16a34a;
}

.alert-date {
  font-size: 12px;
  color: #9ca3af;
}

.alert-desc {
  font-size: 13px;
  color: #374151;
  margin: 0;
  line-height: 1.5;
}
</style>
