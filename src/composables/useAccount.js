import { ref, onMounted } from 'vue';
import { accountService } from '../services/settings/account.service';

export function useAccount() {
  const account = ref(null);
  const loading = ref(true);
  const error = ref('');

  async function fetch() {
    loading.value = true;
    error.value = '';
    try {
      const { data } = await accountService.get();
      account.value = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: 'Caregiver',
        status: 'Active',
        createdAt: null,
        lastAccess: null,
      };
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.title || 'Failed to load account';
      error.value = msg;
      if (window.__toast) window.__toast.error(msg);
    } finally {
      loading.value = false;
    }
  }

  onMounted(fetch);

  return { account, loading, error, fetch };
}
