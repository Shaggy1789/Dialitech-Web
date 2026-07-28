<template>
  <div class="toolbar">
    <div class="search-bar">
      <svg class="search-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="8" cy="8" r="5" stroke="#9ca3af" stroke-width="1.5" />
        <path d="M11.5 11.5L16 16" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" />
      </svg>
      <input
        type="text"
        class="search-input"
        placeholder="Search users by name or email..."
        readonly
      />
    </div>
    <div class="filters">
      <div class="filter-group">
        <label class="filter-label">Role</label>
        <select class="filter-select">
          <option v-for="role in roles" :key="role">{{ role }}</option>
        </select>
      </div>
      <div class="filter-group">
        <label class="filter-label">Status</label>
        <select class="filter-select">
          <option v-for="status in statuses" :key="status">{{ status }}</option>
        </select>
      </div>
      <button class="refresh-btn" title="Refresh">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M15 9C15 12.3 12.3 15 9 15C6.9 15 5.1 13.8 4.2 12M3 9C3 5.7 5.7 3 9 3C11.1 3 12.9 4.2 13.8 6" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 6H14V4" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M6 12H4V14" stroke="#6b7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { roles, statuses } from '../data/users.js';
</script>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.search-bar {
  position: relative;
  flex: 1;
  max-width: 360px;
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
  background: #ffffff;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  cursor: default;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.filters {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  white-space: nowrap;
}

.filter-select {
  padding: 8px 32px 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  color: #374151;
  background: #ffffff;
  outline: none;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  min-width: 130px;
  transition: border-color 0.15s;
}

.filter-select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.refresh-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
}

.refresh-btn:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}
</style>
