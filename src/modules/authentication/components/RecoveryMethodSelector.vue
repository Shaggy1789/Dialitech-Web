<template>
  <div class="selector">
    <label class="selector-label">Recovery Method</label>
    <div class="selector-grid">
      <RecoveryMethodCard
        icon="📧"
        label="Email"
        description="Recover your password using your registered email."
        :selected="modelValue === 'email'"
        @select="$emit('update:modelValue', 'email')"
      />
      <RecoveryMethodCard
        icon="📱"
        label="Phone Number"
        description="Recover your password using your registered phone number."
        :selected="modelValue === 'phone'"
        @select="$emit('update:modelValue', 'phone')"
      />
    </div>
  </div>
</template>

<script setup>
import RecoveryMethodCard from './RecoveryMethodCard.vue';

defineProps({
  modelValue: { type: String, default: '' },
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.selector-label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.selector-grid {
  display: flex;
  gap: 12px;
}
</style>
