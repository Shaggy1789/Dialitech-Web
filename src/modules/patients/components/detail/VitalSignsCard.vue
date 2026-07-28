<template>
  <div class="vital-signs-card">
    <h3 class="vital-signs-title">Vital Signs</h3>
    <div class="vital-grid">
      <div
        v-for="sign in vitalSigns"
        :key="sign.name"
        class="vital-item"
        :class="`color-${sign.color}`"
      >
        <div class="vital-icon" :class="`color-${sign.color}`">
          <svg v-if="sign.icon === 'heart'" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 17C10 17 3 13 3 8C3 5.5 5 3 7.5 3C9 3 10 4.5 10 4.5C10 4.5 11 3 12.5 3C15 3 17 5.5 17 8C17 13 10 17 10 17Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" />
          </svg>
          <svg v-else-if="sign.icon === 'bp'" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M1 10H4L6 6L8 14L10 4L12 12L14 8L16 10H19" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <svg v-else-if="sign.icon === 'temp'" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2V12M10 14C8.5 14 7 13 7 11.5V6C7 4.5 8.5 3 10 3C11.5 3 13 4.5 13 6V11.5C13 13 11.5 14 10 14Z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="10" cy="13" r="3" stroke="currentColor" stroke-width="1.3" />
          </svg>
          <svg v-else-if="sign.icon === 'spo2'" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2C10 2 4 9 4 13C4 16.5 6.5 19 10 19C13.5 19 16 16.5 16 13C16 9 10 2 10 2Z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <svg v-else-if="sign.icon === 'weight'" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="4" y="8" width="12" height="10" rx="2" stroke="currentColor" stroke-width="1.3" />
            <path d="M7 8V6C7 4.5 8.5 3 10 3C11.5 3 13 4.5 13 6V8" stroke="currentColor" stroke-width="1.3" />
            <circle cx="10" cy="12" r="1.5" stroke="currentColor" stroke-width="1.3" />
          </svg>
        </div>
        <div class="vital-info">
          <span class="vital-name">{{ sign.name }}</span>
          <div class="vital-value-row">
            <span class="vital-value">{{ sign.value }}</span>
            <span class="vital-unit">{{ sign.unit }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  vitalSigns: { type: Array, required: true },
});
</script>

<style scoped>
.vital-signs-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
  padding: 20px 24px;
}

.vital-signs-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.vital-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.vital-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 10px;
  background: #f9fafb;
}

.vital-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.vital-icon.color-green {
  background: #f0fdf4;
  color: #16a34a;
}

.vital-icon.color-warning {
  background: #fffbeb;
  color: #d97706;
}

.vital-icon.color-blue {
  background: #eff6ff;
  color: #2563eb;
}

.vital-info {
  min-width: 0;
}

.vital-name {
  display: block;
  font-size: 11px;
  font-weight: 500;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 2px;
}

.vital-value-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.vital-value {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.vital-unit {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.color-green .vital-value {
  color: #16a34a;
}

.color-warning .vital-value {
  color: #d97706;
}

.color-blue .vital-value {
  color: #2563eb;
}
</style>
