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
      <PlanBadge :plan="sub.planId" />

      <div class="notification-wrapper" ref="wrapperRef">
        <button class="notification-btn" @click="toggleDropdown">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2a6 6 0 0 0-6 6v4l-2 2v1h16v-1l-2-2V8a6 6 0 0 0-6-6Z" stroke="#6b7280" stroke-width="1.5" />
            <path d="M8 17a2 2 0 0 0 4 0" stroke="#6b7280" stroke-width="1.5" />
          </svg>
          <Transition name="badge">
            <span v-if="hasUnread" class="notification-badge" :class="{ 'badge-dot': unreadCount > 9 }">
              {{ unreadCount > 9 ? '9+' : unreadCount }}
            </span>
          </Transition>
        </button>

        <Transition name="dropdown">
          <div v-if="showDropdown" class="notification-dropdown">
            <div class="dropdown-header">
              <h3 class="dropdown-title">Notifications</h3>
              <button v-if="hasUnread" class="mark-read-btn" @click="markAllAsRead">Mark all as read</button>
            </div>

            <div class="dropdown-body">
              <div v-if="!notifications.length" class="empty-state">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect x="4" y="8" width="32" height="26" rx="6" stroke="#d1d5db" stroke-width="1.5" />
                  <circle cx="20" cy="18" r="5" stroke="#d1d5db" stroke-width="1.5" />
                  <path d="M14 30c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="#d1d5db" stroke-width="1.5" stroke-linecap="round" />
                </svg>
                <p class="empty-title">No new notifications</p>
                <p class="empty-subtitle">You&apos;re all caught up</p>
              </div>

              <div v-else class="notifications-list">
                <div
                  v-for="n in notifications"
                  :key="n.id"
                  class="notification-item"
                  :class="{ unread: !n.read }"
                  @click="n.read = true"
                >
                  <div class="notif-icon" :class="n.icon">
                    <svg v-if="n.icon === 'critical'" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6" fill="#dc2626" />
                      <path d="M8 5v3M8 11v1" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                    <svg v-else-if="n.icon === 'warning'" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 2L1 14h14L8 2z" fill="#d97706" />
                      <path d="M8 6v3M8 12v1" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                    <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6" fill="#2563eb" />
                      <path d="M8 5v4M8 11v1" stroke="#fff" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                  </div>
                  <div class="notif-body">
                    <p class="notif-title">{{ n.title }}</p>
                    <p class="notif-desc">{{ n.description }}</p>
                    <span class="notif-time">{{ n.date }} · {{ n.time }}</span>
                  </div>
                  <div v-if="!n.read" class="notif-dot" />
                </div>
              </div>
            </div>

            <div class="dropdown-footer">
              <router-link to="/alerts" class="view-all-link" @click="showDropdown = false">View all alerts</router-link>
            </div>
          </div>
        </Transition>
      </div>

      <div class="user-menu">
        <div class="avatar">{{ initials }}</div>
        <div class="user-info">
          <span class="user-name">{{ authStore.userName || 'Dr. Sarah Wilson' }}</span>
          <span class="user-role">{{ userRoleLabel }}</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useSubscriptionStore } from '../stores/subscriptionStore';
import { useNotifications } from '../composables/useNotifications';
import PlanBadge from './PlanBadge.vue';

const authStore = useAuthStore();
const sub = useSubscriptionStore();
const { notifications, unreadCount, hasUnread, markAllAsRead } = useNotifications();

const showDropdown = ref(false);
const wrapperRef = ref(null);

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
  if (showDropdown.value && hasUnread.value) {
    markAllAsRead();
  }
}

function onClickOutside(e) {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target)) {
    showDropdown.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside);
});

const initials = computed(() => {
  return (authStore.userName || 'Dr. Sarah Wilson')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

const userRoleLabel = computed(() => {
  const labels = { patient: 'Patient', caregiver: 'Caregiver', admin: 'Administrator' };
  return labels[sub.role] || 'Nephrologist';
});
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

.notification-wrapper {
  position: relative;
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
  position: relative;
}

.notification-btn:hover {
  background: #e5e7eb;
}

.notification-badge {
  position: absolute;
  top: -3px;
  right: -3px;
  min-width: 18px;
  height: 18px;
  background: #dc2626;
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  padding: 0 4px;
  border: 2px solid #ffffff;
  pointer-events: none;
}

.badge-dot {
  min-width: 18px;
  padding: 0 4px;
}

.badge-enter-active {
  animation: badgePop 0.3s ease;
}

.badge-leave-active {
  animation: badgePop 0.2s ease reverse;
}

@keyframes badgePop {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}

.notification-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 380px;
  max-height: 520px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.14), 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  z-index: 100;
}

.dropdown-enter-active {
  transition: all 0.2s ease-out;
}

.dropdown-leave-active {
  transition: all 0.15s ease-in;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 12px;
  border-bottom: 1px solid #f3f4f6;
}

.dropdown-title {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.mark-read-btn {
  font-size: 12px;
  font-weight: 500;
  color: #2563eb;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.15s;
}

.mark-read-btn:hover {
  background: #eff6ff;
}

.dropdown-body {
  overflow-y: auto;
  max-height: 360px;
}

.notifications-list {
  display: flex;
  flex-direction: column;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 20px;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid #f3f4f6;
  position: relative;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-item:hover {
  background: #f9fafb;
}

.notification-item.unread {
  background: #f0f5ff;
}

.notification-item.unread:hover {
  background: #e8f0fe;
}

.notif-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notif-icon.critical {
  background: #fef2f2;
}

.notif-icon.warning {
  background: #fffbeb;
}

.notif-icon.info {
  background: #eff6ff;
}

.notif-body {
  flex: 1;
  min-width: 0;
}

.notif-title {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 2px;
}

.notif-desc {
  font-size: 12px;
  color: #6b7280;
  margin: 0 0 4px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.notif-time {
  font-size: 11px;
  color: #9ca3af;
}

.notif-dot {
  width: 8px;
  height: 8px;
  background: #2563eb;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 6px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  text-align: center;
}

.empty-title {
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  margin: 12px 0 4px;
}

.empty-subtitle {
  font-size: 13px;
  color: #9ca3af;
  margin: 0;
}

.dropdown-footer {
  padding: 12px 20px;
  border-top: 1px solid #f3f4f6;
  text-align: center;
}

.view-all-link {
  font-size: 13px;
  font-weight: 500;
  color: #2563eb;
  text-decoration: none;
  transition: color 0.15s;
}

.view-all-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
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
