<template>
  <div class="user-type-selection">
    <h2 class="selection-title">Create your account</h2>
    <p class="selection-desc">Choose how you want to register in DiaMonitor.</p>

    <div class="type-cards">
      <UserTypeCard
        title="Caregiver"
        description="Monitor patients, receive alerts, manage treatments and follow patient progress."
        buttonText="Register as Caregiver"
        type="caregiver"
        @click="$emit('select', 'caregiver')"
      >
        <template #icon>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="12" fill="#eff6ff" />
            <path d="M24 22C26.761 22 29 19.761 29 17C29 14.239 26.761 12 24 12C21.239 12 19 14.239 19 17C19 19.761 21.239 22 24 22Z" stroke="#2563eb" stroke-width="1.8" />
            <path d="M14 34C14 29.582 18.477 26 24 26C29.523 26 34 29.582 34 34" stroke="#2563eb" stroke-width="1.8" stroke-linecap="round" />
            <path d="M33 16L36 19L33 22" stroke="#2563eb" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M36 19H30" stroke="#2563eb" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </template>
      </UserTypeCard>

      <UserTypeCard
        title="Patient"
        description="Access your medical information, review treatment history and communicate with your caregiver."
        buttonText="Register as Patient"
        type="patient"
        @click="$emit('select', 'patient')"
      >
        <template #icon>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="12" fill="#f0fdf4" />
            <circle cx="22" cy="18" r="6" stroke="#16a34a" stroke-width="1.8" />
            <path d="M14 34C14 30.134 17.582 27 22 27" stroke="#16a34a" stroke-width="1.8" stroke-linecap="round" />
            <path d="M30 26V36" stroke="#16a34a" stroke-width="1.8" stroke-linecap="round" />
            <path d="M25 31H35" stroke="#16a34a" stroke-width="1.8" stroke-linecap="round" />
          </svg>
        </template>
      </UserTypeCard>
    </div>

    <button class="continue-btn" disabled>
      Continue
    </button>

    <div class="register-footer">
      <span class="footer-text">Already have an account?</span>
      <router-link to="/login" class="footer-link">Sign In</router-link>
    </div>
  </div>
</template>

<script setup>
import UserTypeCard from './UserTypeCard.vue';

defineEmits(['select']);
</script>

<style scoped>
.user-type-selection {
  text-align: center;
}

.selection-title {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 6px 0;
}

.selection-desc {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 28px 0;
  line-height: 1.5;
}

.type-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 28px;
}

.continue-btn {
  width: 100%;
  padding: 12px;
  background: #f3f4f6;
  color: #d1d5db;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: not-allowed;
  transition: none;
}

.register-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 20px;
}

.footer-text {
  font-size: 14px;
  color: #6b7280;
}

.footer-link {
  font-size: 14px;
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}

.footer-link:hover {
  text-decoration: underline;
}
</style>
