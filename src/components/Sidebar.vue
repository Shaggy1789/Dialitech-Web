<template>
  <aside class="sidebar">
    <div class="brand">
      <div class="logo">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#2563eb" />
          <path d="M8 16C8 11.5817 11.5817 8 16 8V24C11.5817 24 8 20.4183 8 16Z" fill="#fff" fill-opacity="0.9" />
          <path d="M16 8C20.4183 8 24 11.5817 24 16S20.4183 24 16 24" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
          <circle cx="16" cy="16" r="3" fill="#fff" />
        </svg>
      </div>
      <span class="brand-name">DiaMonitor</span>
    </div>
    <nav class="menu">
      <router-link to="/dashboard" class="menu-item">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="2" width="7" height="7" rx="1.5" fill="currentColor" />
          <rect x="11" y="2" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.4" />
          <rect x="2" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.4" />
          <rect x="11" y="11" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.4" />
        </svg>
        Dashboard
      </router-link>
      <router-link to="/patients" class="menu-item">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="7" cy="6" r="3" stroke="currentColor" stroke-width="1.5" />
          <path d="M1 17c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          <path d="M13 7h6M16 4v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        Patients
      </router-link>
      <router-link to="/alerts" class="menu-item">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 2a6 6 0 0 0-6 6v4l-2 2v1h16v-1l-2-2V8a6 6 0 0 0-6-6Z" stroke="currentColor" stroke-width="1.5" />
          <circle cx="13.5" cy="4" r="3.5" fill="#ef4444" stroke="#fff" stroke-width="1.5" />
          <path d="M8 17a2 2 0 0 0 4 0" stroke="currentColor" stroke-width="1.5" />
        </svg>
        Alerts
      </router-link>
      <router-link to="/users" class="menu-item">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="7" cy="6" r="2.5" stroke="currentColor" stroke-width="1.5" />
          <circle cx="14" cy="6" r="2.5" stroke="currentColor" stroke-width="1.5" />
          <path d="M1 16c0-2.5 2-4.5 4.5-4.5h3c2.5 0 4.5 2 4.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          <path d="M14 11.5c2.5 0 4.5 2 4.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        User Management
      </router-link>
      <router-link to="/settings" class="menu-item">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="1.5" />
          <path d="M10 2V4M10 16V18M18 10H16M4 10H2M15.66 4.34L-1.34 9.66M4.34 4.34L9.66 9.66" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        Settings
      </router-link>
    </nav>
    <div class="user-card">
      <div class="avatar">SW</div>
      <div class="user-details">
        <p class="user-name">Dr. Sarah Wilson</p>
        <p class="user-role">Nephrologist</p>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 250px;
  background: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.03);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 20px 28px;
}

.brand-name {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.menu {
  flex: 1;
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  text-decoration: none;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s ease;
}

.menu-item:hover {
  background: #f3f4f6;
  color: #374151;
}

.menu-item.active {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 600;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
  margin: 12px;
  background: #f9fafb;
  border-radius: 10px;
}

.avatar {
  width: 36px;
  height: 36px;
  background: #2563eb;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
}

.user-details {
  min-width: 0;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 11px;
  color: #9ca3af;
}
</style>
