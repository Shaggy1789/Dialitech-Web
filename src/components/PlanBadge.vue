<template>
  <span class="plan-badge" :class="planClass">{{ planName }}</span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  plan: { type: String, default: 'free' },
});

const planName = computed(() => {
  const names = { free: 'Free', basic: 'Basic', professional: 'Professional', enterprise: 'Enterprise' };
  return names[props.plan] || 'Free';
});

const planClass = computed(() => `plan-${props.plan}`);
</script>

<style scoped>
.plan-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.plan-free {
  background: #f3f4f6;
  color: #6b7280;
}

.plan-basic {
  background: #dbeafe;
  color: #2563eb;
}

.plan-professional {
  background: #e0e7ff;
  color: #4f46e5;
}

.plan-enterprise {
  background: #f3e8ff;
  color: #7c3aed;
}
</style>
