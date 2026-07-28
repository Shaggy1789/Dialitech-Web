<template>
  <header class="topnavbar">
    <div class="search-bar">
      <svg class="search-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="8" cy="8" r="5" stroke="#9ca3af" stroke-width="1.5" />
        <path d="M11.5 11.5L16 16" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" />
      </svg>
      <input
        type="text"
        class="search-input"
        placeholder="Search patients, alerts, reports..."
      />
    </div>
    <div class="right-section">
      <button class="notification-btn">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 2a6 6 0 0 0-6 6v4l-2 2v1h16v-1l-2-2V8a6 6 0 0 0-6-6Z" stroke="#6b7280" stroke-width="1.5" />
          <circle cx="14" cy="4" r="3.5" fill="#ef4444" stroke="#fff" stroke-width="1.5" />
          <path d="M8 17a2 2 0 0 0 4 0" stroke="#6b7280" stroke-width="1.5" />
        </svg>
      </button>
      <div class="user-menu">
        <div class="avatar">SW</div>
        <div class="user-info">
          <span class="user-name">Dr. Sarah Wilson</span>
          <span class="user-role">Nephrologist</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
</script>

<style scoped>
.topnavbar {
  background: #ffffff;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.search-bar {
  position: relative;
  flex: 1;
  max-width: 480px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 14px 10px 42px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  color: #374151;
  background: #f9fafb;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  background: #fff;
}

.right-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.notification-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #f3f4f6;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
}

.notification-btn:hover {
  background: #e5e7eb;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.avatar {
  width: 40px;
  height: 40px;
  background: #2563eb;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.user-role {
  font-size: 12px;
  color: #9ca3af;
}
</style>