<template>
  <div class="register-page">
    <div class="register-left">
      <div class="left-content">
        <div class="left-brand">
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#2563eb" />
            <path d="M8 16C8 11.5817 11.5817 8 16 8V24C11.5817 24 8 20.4183 8 16Z" fill="#fff" fill-opacity="0.9" />
            <path d="M16 8C20.4183 8 24 11.5817 24 16S20.4183 24 16 24" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
            <circle cx="16" cy="16" r="3" fill="#fff" />
          </svg>
          <span class="left-brand-name">DiaMonitor</span>
        </div>
        <div class="left-illustration">
          <svg width="320" height="280" viewBox="0 0 320 280" fill="none">
            <rect x="40" y="30" width="240" height="180" rx="16" fill="#eff6ff" />
            <rect x="60" y="50" width="200" height="12" rx="6" fill="#dbeafe" />
            <rect x="60" y="74" width="140" height="10" rx="5" fill="#e5e7eb" />
            <rect x="60" y="94" width="160" height="10" rx="5" fill="#e5e7eb" />
            <circle cx="80" cy="130" r="18" fill="#dbeafe" />
            <rect x="106" y="118" width="100" height="10" rx="5" fill="#e5e7eb" />
            <rect x="106" y="136" width="70" height="8" rx="4" fill="#f3f4f6" />
            <circle cx="80" cy="180" r="18" fill="#dbeafe" />
            <rect x="106" y="168" width="100" height="10" rx="5" fill="#e5e7eb" />
            <rect x="106" y="186" width="70" height="8" rx="4" fill="#f3f4f6" />
            <path d="M80 210L120 240H40L80 210Z" fill="#dbeafe" />
            <rect x="200" y="120" width="60" height="60" rx="12" fill="#2563eb" fill-opacity="0.1" />
            <path d="M220 140L228 148L236 140" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M228 148V160" stroke="#2563eb" stroke-width="2" stroke-linecap="round" />
            <rect x="50" y="220" width="20" height="20" rx="4" fill="#2563eb" fill-opacity="0.08" />
            <rect x="82" y="220" width="20" height="20" rx="4" fill="#2563eb" fill-opacity="0.08" />
            <rect x="114" y="220" width="20" height="20" rx="4" fill="#2563eb" fill-opacity="0.08" />
          </svg>
        </div>
        <h2 class="left-title">Start Monitoring<br />Your Patients Today</h2>
        <p class="left-desc">Create your account and get access to real-time patient monitoring, intelligent alerts, and comprehensive care management tools.</p>
      </div>
    </div>

    <div class="register-right">
      <RegisterCard>
        <StepIndicator :currentStep="currentStep" />

        <UserTypeSelection
          v-if="currentStep === 1"
          @select="onTypeSelected"
        />

        <template v-if="currentStep === 2">
          <CaregiverRegisterForm ref="caregiverForm" v-if="selectedType === 'caregiver'" />
          <PatientRegisterForm ref="patientForm" v-if="selectedType === 'patient'" />

          <TermsCheckbox />

          <p v-if="authStore.error" class="error-msg">{{ authStore.error }}</p>

          <button class="register-btn" :disabled="authStore.loading" @click="submitRegistration">
            {{ authStore.loading ? 'Creating account...' : 'Create Account' }}
          </button>

          <button class="back-btn" @click="goBack">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            Back
          </button>
        </template>
      </RegisterCard>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../../stores/authStore';
import RegisterCard from '../components/RegisterCard.vue';
import StepIndicator from '../components/StepIndicator.vue';
import UserTypeSelection from '../components/UserTypeSelection.vue';
import CaregiverRegisterForm from '../components/CaregiverRegisterForm.vue';
import PatientRegisterForm from '../components/PatientRegisterForm.vue';
import TermsCheckbox from '../components/TermsCheckbox.vue';

const router = useRouter();
const authStore = useAuthStore();

const currentStep = ref(1);
const selectedType = ref(null);
const caregiverForm = ref(null);
const patientForm = ref(null);

function onTypeSelected(type) {
  selectedType.value = type;
  currentStep.value = 2;
}

function goBack() {
  currentStep.value = 1;
  selectedType.value = null;
}

async function submitRegistration() {
  const form = selectedType.value === 'caregiver' ? caregiverForm.value : patientForm.value;
  if (!form) return;

  const payload = form.getPayload();
  try {
    await authStore.register(payload);
    router.push('/login');
  } catch {
    /* error is stored in authStore.error */
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  background: #f8f9fa;
}

.register-left {
  width: 45%;
  min-width: 440px;
  background: linear-gradient(135deg, #f0f5ff 0%, #e8f0fe 50%, #f8f9fa 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  position: relative;
  overflow: hidden;
}

.register-left::before {
  content: '';
  position: absolute;
  top: -120px;
  right: -120px;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  background: rgba(37, 99, 235, 0.04);
}

.register-left::after {
  content: '';
  position: absolute;
  bottom: -80px;
  left: -80px;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: rgba(37, 99, 235, 0.03);
}

.left-content {
  max-width: 380px;
  position: relative;
  z-index: 1;
}

.left-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 48px;
}

.left-brand-name {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
}

.left-illustration {
  margin-bottom: 36px;
}

.left-title {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
  margin: 0 0 14px 0;
  letter-spacing: -0.3px;
}

.left-desc {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.7;
  margin: 0;
}

.register-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  overflow-y: auto;
}

.error-msg {
  color: #ef4444;
  font-size: 13px;
  text-align: center;
  margin: 8px 0 0;
}

.register-btn {
  width: 100%;
  padding: 12px;
  background: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  margin-top: 24px;
}

.register-btn:hover {
  background: #1d4ed8;
}

.register-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 10px;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.15s;
  margin-top: 10px;
}

.back-btn:hover {
  color: #374151;
}
</style>
