<template>
  <div class="register-form">
    <h2 class="form-title">Register as Caregiver</h2>

    <RegisterAvatarUploader />

    <div class="fields-grid">
      <div class="field">
        <label class="field-label">First Name</label>
        <input v-model="form.firstName" class="field-input" placeholder="John" />
      </div>
      <div class="field">
        <label class="field-label">Last Name</label>
        <input v-model="form.lastName" class="field-input" placeholder="Doe" />
      </div>
      <div class="field">
        <label class="field-label">Email</label>
        <input v-model="form.email" type="email" class="field-input" placeholder="you@example.com" />
      </div>
      <div class="field">
        <label class="field-label">Phone</label>
        <input v-model="form.phone" type="tel" class="field-input" placeholder="+1 (555) 000-0000" />
      </div>
      <div class="field">
        <label class="field-label">Username</label>
        <input v-model="form.username" class="field-input" placeholder="johndoe" />
      </div>
      <div class="field">
        <label class="field-label">Gender</label>
        <select v-model="form.gender" class="field-select">
          <option value="" disabled selected>Select</option>
          <option>Male</option>
          <option>Female</option>
          <option>Non-binary</option>
          <option>Prefer not to say</option>
        </select>
      </div>
      <div class="field">
        <label class="field-label">Date of Birth</label>
        <input v-model="form.dob" class="field-input" type="date" />
      </div>
      <div class="field" />
      <div class="field">
        <label class="field-label">Password</label>
        <div class="input-wrapper">
          <input v-model="form.password" class="field-input" type="password" placeholder="••••••••" />
          <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5C7 5 2.73 8.11 1 12C2.73 15.89 7 19 12 19C17 19 21.27 15.89 23 12C21.27 8.11 17 5 12 5Z" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" />
            <circle cx="12" cy="12" r="3" stroke="#9ca3af" stroke-width="1.5" />
          </svg>
        </div>
      </div>
      <div class="field">
        <label class="field-label">Confirm Password</label>
        <div class="input-wrapper">
          <input v-model="form.confirmPassword" class="field-input" type="password" placeholder="••••••••" />
          <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5C7 5 2.73 8.11 1 12C2.73 15.89 7 19 12 19C17 19 21.27 15.89 23 12C21.27 8.11 17 5 12 5Z" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" />
            <circle cx="12" cy="12" r="3" stroke="#9ca3af" stroke-width="1.5" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import RegisterAvatarUploader from './RegisterAvatarUploader.vue';

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  username: '',
  gender: '',
  dob: '',
  password: '',
  confirmPassword: '',
});

function getPayload() {
  return {
    name: `${form.firstName} ${form.lastName}`.trim(),
    email: form.email,
    password: form.password,
    plan: 'free',
    age: form.dob ? new Date().getFullYear() - new Date(form.dob).getFullYear() : 0,
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

.field-input::placeholder {
  color: #d1d5db;
}

.field-select {
  width: 100%;
  padding: 10px 32px 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  color: #374151;
  background: #f9fafb;
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='11' height='7' viewBox='0 0 11 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.5 1.5L5.5 5.5L9.5 1.5' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 11px center;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-sizing: border-box;
}

.field-select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  background: #ffffff;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper .field-input {
  padding-right: 36px;
}

.input-icon {
  position: absolute;
  right: 11px;
  pointer-events: none;
}
</style>
