<template>
  <div class="register-form">
    <h2 class="form-title">Register as Caregiver</h2>

    <RegisterAvatarUploader />

    <div class="fields-grid">
      <div class="field">
        <label class="field-label">First Name</label>
        <input v-model="form.name" class="field-input" :class="{ 'input-error': fieldErrors?.name }" placeholder="John" />
        <p v-if="fieldErrors?.name" class="field-error">{{ fieldErrors.name }}</p>
      </div>
      <div class="field">
        <label class="field-label">Last Name</label>
        <input v-model="form.lastname" class="field-input" placeholder="Doe" />
      </div>
      <div class="field">
        <label class="field-label">Email</label>
        <input v-model="form.email" type="email" class="field-input" :class="{ 'input-error': fieldErrors?.email }" placeholder="you@example.com" />
        <p v-if="fieldErrors?.email" class="field-error">{{ fieldErrors.email }}</p>
      </div>
      <div class="field">
        <label class="field-label">Phone</label>
        <input v-model="form.phone" type="tel" class="field-input" :class="{ 'input-error': fieldErrors?.phone }" placeholder="+1 (555) 000-0000" />
        <p v-if="fieldErrors?.phone" class="field-error">{{ fieldErrors.phone }}</p>
      </div>
      <div class="field">
        <label class="field-label">Password</label>
        <input v-model="form.password" type="password" class="field-input" :class="{ 'input-error': fieldErrors?.password }" placeholder="••••••••" />
        <p v-if="fieldErrors?.password" class="field-error">{{ fieldErrors.password }}</p>
      </div>
      <div class="field">
        <label class="field-label">Confirm Password</label>
        <input v-model="form.confirmPassword" type="password" class="field-input" placeholder="••••••••" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { useAuthStore } from '../../../stores/authStore';
import RegisterAvatarUploader from './RegisterAvatarUploader.vue';

const authStore = useAuthStore();
const fieldErrors = computed(() => authStore.fieldErrors || {});

const form = reactive({
  name: '',
  lastname: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
});

function getPayload() {
  return {
    name: form.name,
    lastname: form.lastname,
    email: form.email,
    phone: form.phone,
    password: form.password,
    imageUrl: '',
    plan: 'free',
  };
}

defineExpose({ form, getPayload });
</script>

<style scoped>
.register-form {
  text-align: left;
}

.form-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px 0;
  text-align: center;
}

.fields-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.field-label {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

.field-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  color: #374151;
  background: #f9fafb;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-sizing: border-box;
}

.field-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  background: #ffffff;
}

.field-input.input-error {
  border-color: #dc2626;
  background: #fef2f2;
}

.field-input.input-error:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  border-color: #dc2626;
}

.field-error {
  font-size: 12px;
  color: #dc2626;
  margin: 0;
}

.field-input::placeholder {
  color: #d1d5db;
}
</style>
