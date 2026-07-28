<template>
  <div class="field">
    <label class="field-label">{{ label }}</label>
    <input
      v-model="inputValue"
      :type="inputType"
      class="field-input"
      :placeholder="placeholder"
      :required="required"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  method: { type: String, default: '' },
  modelValue: { type: String, default: '' },
  required: { type: Boolean, default: true },
});

const emit = defineEmits(['update:modelValue']);

const inputValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const label = computed(() => {
  if (props.method === 'phone') return 'Phone Number';
  return 'Email Address';
});

const inputType = computed(() => {
  if (props.method === 'phone') return 'tel';
  return 'email';
});

const placeholder = computed(() => {
  if (props.method === 'phone') return '+1 (555) 000-0000';
  return 'you@example.com';
});
</script>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.field-input {
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  color: #374151;
  background: #f9fafb;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.field-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  background: #ffffff;
}
</style>
