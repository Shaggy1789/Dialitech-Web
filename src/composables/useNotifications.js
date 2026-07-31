import { ref, computed, onMounted } from 'vue';
import { alertService } from '../services/alertService';
import { useAuthStore } from '../stores/authStore';

const notifications = ref([]);
const loading = ref(false);

export function useNotifications() {
  const authStore = useAuthStore();

  const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length);
  const hasUnread = computed(() => unreadCount.value > 0);

  async function fetchAll() {
    loading.value = true;
    try {
      const { data } = await alertService.getAll();
      notifications.value = (data || []).map((a) => ({
        id: a.id,
        icon: a.severity >= 3 ? 'critical' : a.severity >= 2 ? 'warning' : 'info',
        title: a.type || 'Alert',
        description: a.message || '',
        time: a.createdAt ? formatTime(a.createdAt) : '',
        date: a.createdAt ? a.createdAt.split('T')[0] : '',
        read: a.isRead || false,
      }));
    } catch {
      seedMockNotifications();
    } finally {
      loading.value = false;
    }
  }

  function seedMockNotifications() {
    if (notifications.value.length) return;
    notifications.value = [
      { id: 'm1', icon: 'critical', title: 'Critical Alert', description: 'Robert Smith - Blood pressure significantly elevated (180/110 mmHg)', time: '10:42 AM', date: '2026-07-23', read: false },
      { id: 'm2', icon: 'warning', title: 'Missed Session', description: 'Maria Garcia missed scheduled dialysis without notification', time: '09:15 AM', date: '2026-07-23', read: false },
      { id: 'm3', icon: 'info', title: 'Lab Result', description: 'James Johnson - Potassium levels elevated (5.4 mEq/L)', time: '04:30 PM', date: '2026-07-22', read: false },
      { id: 'm4', icon: 'critical', title: 'Equipment Issue', description: 'Dialysis machine pressure irregularity - maintenance needed', time: '02:15 PM', date: '2026-07-22', read: true },
      { id: 'm5', icon: 'info', title: 'Medication Reminder', description: 'Linda Davis - Prescription renewal due for Erythropoietin', time: '11:00 AM', date: '2026-07-22', read: true },
    ];
  }

  function markAllAsRead() {
    notifications.value.forEach((n) => { n.read = true; });
  }

  function removeNotification(id) {
    notifications.value = notifications.value.filter((n) => n.id !== id);
  }

  onMounted(() => {
    if (authStore.isAuthenticated) {
      fetchAll();
    }
  });

  return {
    notifications,
    unreadCount,
    hasUnread,
    loading,
    fetchAll,
    markAllAsRead,
    removeNotification,
  };
}

function formatTime(timestamp) {
  const d = new Date(timestamp);
  const hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return `${h}:${minutes} ${ampm}`;
}
