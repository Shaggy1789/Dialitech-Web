<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-brand">
        <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#2563eb" />
          <path d="M8 16C8 11.5817 11.5817 8 16 8V24C11.5817 24 8 20.4183 8 16Z" fill="#fff" fill-opacity="0.9" />
          <path d="M16 8C20.4183 8 24 11.5817 24 16S20.4183 24 16 24" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
          <circle cx="16" cy="16" r="3" fill="#fff" />
        </svg>
        <span class="login-brand-name">DiaMonitor</span>
      </div>
      <h1 class="login-title">Welcome back</h1>
      <p class="login-subtitle">Sign in to your account to continue</p>
      <form class="login-form">
        <div class="field">
          <label class="field-label">Email</label>
          <input type="email" class="field-input" placeholder="you@example.com" readonly />
        </div>
        <div class="field">
          <label class="field-label">Password</label>
          <input type="password" class="field-input" placeholder="••••••••" readonly />
        </div>
        <button type="submit" class="login-btn">Sign In</button>
      </form>
      <p class="login-footer">
        Don&apos;t have an account?
        <router-link to="/register" class="login-link">Register</router-link>
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
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  padding: 24px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04);
  border: 1px solid #f3f4f6;
  padding: 40px 36px;
  text-align: center;
}

.login-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 28px;
}

.login-brand-name {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
}

.login-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 6px 0;
}

.login-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 28px 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}

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

.login-btn {
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

.login-btn:hover {
  background: #1d4ed8;
}

.login-footer {
  font-size: 14px;
  color: #6b7280;
  margin: 24px 0 16px 0;
}

.login-link {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}

.login-link:hover {
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
