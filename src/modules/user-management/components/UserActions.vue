<template>
  <div class="actions">
    <button class="action-btn" title="View user">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 3C4.5 3 1.5 8 1.5 8C1.5 8 4.5 13 8 13C11.5 13 14.5 8 14.5 8C14.5 8 11.5 3 8 3Z" stroke="#6b7280" stroke-width="1.3" />
        <circle cx="8" cy="8" r="2.5" stroke="#6b7280" stroke-width="1.3" />
      </svg>
    </button>
    <button class="action-btn" title="Edit user">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M11.5 1.5L14.5 4.5L5.5 13.5L1.5 14.5L2.5 10.5L11.5 1.5Z" stroke="#6b7280" stroke-width="1.3" stroke-linejoin="round" />
        <path d="M9.5 3.5L12.5 6.5" stroke="#6b7280" stroke-width="1.3" />
      </svg>
    </button>
    <button class="action-btn danger" title="Delete user">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 4H14" stroke="#6b7280" stroke-width="1.3" stroke-linecap="round" />
        <path d="M5 4V3C5 1.9 5.9 1 7 1H9C10.1 1 11 1.9 11 3V4" stroke="#6b7280" stroke-width="1.3" stroke-linecap="round" />
        <path d="M12 4V13C12 14.1 11.1 15 10 15H6C4.9 15 4 14.1 4 13V4" stroke="#6b7280" stroke-width="1.3" stroke-linecap="round" />
      </svg>
    </button>
    <button class="action-btn" title="More options">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="3" r="1.5" fill="#9ca3af" />
        <circle cx="8" cy="8" r="1.5" fill="#9ca3af" />
        <circle cx="8" cy="13" r="1.5" fill="#9ca3af" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.actions {
  display: flex;
  align-items: center;
  gap: 2px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
}

.action-btn:hover {
  background: #f3f4f6;
}

.action-btn:hover svg path,
.action-btn:hover svg circle {
  stroke: #2563eb;
}

.action-btn.danger:hover svg path {
  stroke: #dc2626;
}

.action-btn:hover svg circle[fill] {
  fill: #2563eb;
}

.action-btn.danger:hover svg circle[fill] {
  fill: #dc2626;
}
</style>
