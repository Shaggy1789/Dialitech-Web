<template>
  <div class="register-page">
    <div class="register-card">
      <div class="register-brand">
        <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#2563eb" />
          <path d="M8 16C8 11.5817 11.5817 8 16 8V24C11.5817 24 8 20.4183 8 16Z" fill="#fff" fill-opacity="0.9" />
          <path d="M16 8C20.4183 8 24 11.5817 24 16S20.4183 24 16 24" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
          <circle cx="16" cy="16" r="3" fill="#fff" />
        </svg>
        <span class="register-brand-name">DiaMonitor</span>
      </div>
      <h1 class="register-title">Create an account</h1>
      <p class="register-subtitle">Register to start managing your patients</p>

      <div class="register-placeholder">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <rect x="8" y="14" width="32" height="28" rx="4" stroke="#d1d5db" stroke-width="2" />
          <path d="M16 14V10C16 8 18 6 24 6C30 6 32 8 32 10V14" stroke="#d1d5db" stroke-width="2" stroke-linecap="round" />
          <circle cx="24" cy="24" r="4" stroke="#d1d5db" stroke-width="2" />
          <path d="M24 28v6" stroke="#d1d5db" stroke-width="2" stroke-linecap="round" />
        </svg>
        <h3 class="placeholder-title">Registration Form Coming Soon</h3>
        <p class="placeholder-desc">The caregiver registration form will be implemented in the next phase.</p>
      </div>

      <p class="register-footer">
        Already have an account?
        <router-link to="/login" class="register-link">Sign In</router-link>
      </p>
      <router-link to="/" class="back-link">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8L10 13" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Back to Home
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  padding: 24px;
}

.register-card {
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
  padding: 40px 36px;
  text-align: center;
}

.register-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 28px;
}

.register-brand-name {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
}

.register-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 6px 0;
}

.register-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 32px 0;
}

.register-placeholder {
  padding: 32px 16px;
  background: #f9fafb;
  border-radius: 12px;
  border: 2px dashed #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.placeholder-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0;
}

.placeholder-desc {
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
  line-height: 1.5;
}

.register-footer {
  font-size: 14px;
  color: #6b7280;
  margin: 24px 0 16px 0;
}

.register-link {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.15s;
}

.back-link:hover {
  color: #6b7280;
}
</style>
