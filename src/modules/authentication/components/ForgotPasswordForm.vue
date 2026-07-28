<template>
  <form class="forgot-form" @submit.prevent="$emit('submit')">
    <RecoveryMethodSelector v-model="method" />

    <RecoveryInput
      v-if="method"
      :method="method"
      v-model="value"
    />

    <p v-if="error" class="error-msg">{{ error }}</p>

    <button
      type="submit"
      class="submit-btn"
      :disabled="!method || !value || loading"
    >
      {{ loading ? 'Sending...' : 'Send Recovery Code' }}
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import RecoveryMethodSelector from './RecoveryMethodSelector.vue';
import RecoveryInput from './RecoveryInput.vue';

defineProps({
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
});

const emit = defineEmits(['submit']);

const method = ref('');
const value = ref('');

function getPayload() {
  if (!method.value) return null;
  return { method: method.value, value: value.value };
}

defineExpose({ method, value, getPayload });
</script>

<style scoped>
.forgot-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
}

.error-msg {
  color: #ef4444;
  font-size: 13px;
  margin: 0;
}

.submit-btn {
  padding: 12px;
  background: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  margin-top: 4px;
}

.submit-btn:hover {
  background: #1d4ed8;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
