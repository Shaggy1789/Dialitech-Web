<template>
  <button
    class="method-card"
    :class="{ selected }"
    @click="$emit('select')"
    type="button"
  >
    <span class="method-icon">{{ icon }}</span>
    <span class="method-label">{{ label }}</span>
    <span class="method-desc">{{ description }}</span>
  </button>
</template>

<script setup>
defineProps({
  icon: { type: String, required: true },
  label: { type: String, required: true },
  description: { type: String, required: true },
  selected: { type: Boolean, default: false },
});

defineEmits(['select']);
</script>

<style scoped>
.method-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 20px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  text-align: center;
}

.method-card:hover {
  border-color: #93c5fd;
  background: #fafbff;
}

.method-card.selected {
  border-color: #2563eb;
  background: #eff6ff;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.method-icon {
  font-size: 28px;
  line-height: 1;
}

.method-label {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.method-desc {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
}
</style>
