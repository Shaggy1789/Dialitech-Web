import { defineStore } from 'pinia';
import { ref } from 'vue';
import { alertService } from '../services/alertService';
import { alerts as mockAlerts } from '../modules/alerts/data/alerts';

export const useAlertStore = defineStore('alerts', () => {
  const alerts = ref([...mockAlerts]);
  const loading = ref(false);
  const error = ref('');

  async function fetchByUser(userId) {
    loading.value = true;
    error.value = '';
    try {
      const { data } = await alertService.getByUser(userId);
      alerts.value = data.map(mapApiAlertToFrontend);
    } catch {
      alerts.value = [...mockAlerts];
    } finally {
      loading.value = false;
    }
  }

  return { alerts, loading, error, fetchByUser };
});

function mapApiAlertToFrontend(apiAlert) {
  return {
    id: apiAlert.id,
    patientName: apiAlert.userName || 'Unknown',
    type: apiAlert.type,
    priority: apiAlert.severity >= 3 ? 'Critical' : apiAlert.severity >= 2 ? 'High' : apiAlert.severity >= 1 ? 'Medium' : 'Low',
    date: apiAlert.timestamp ? apiAlert.timestamp.split('T')[0] : 'N/A',
    time: apiAlert.timestamp ? new Date(apiAlert.timestamp).toLocaleTimeString() : 'N/A',
    description: apiAlert.message,
    status: apiAlert.isRead ? 'Resolved' : 'Active',
  };
}
