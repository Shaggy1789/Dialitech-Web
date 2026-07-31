import { ref, reactive, onMounted } from 'vue';
import { profileService } from '../services/settings/profile.service';

export function useProfile() {
  const profile = ref(null);
  const loading = ref(true);
  const error = ref('');
  const saving = ref(false);

  const form = reactive({
    name: '',
    lastname: '',
    phone: '',
    email: '',
    imageUrl: '',
  });

  async function fetch() {
    loading.value = true;
    error.value = '';
    try {
      const { data } = await profileService.get();
      profile.value = data;
      form.name = data.name || '';
      form.lastname = data.lastname || '';
      form.phone = data.phone || '';
      form.email = data.email || '';
      form.imageUrl = data.imageUrl || '';
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.title || 'Failed to load profile';
      error.value = msg;
      if (window.__toast) window.__toast.error(msg);
    } finally {
      loading.value = false;
    }
  }

  async function save() {
    saving.value = true;
    error.value = '';
    try {
      const { data } = await profileService.update({
        name: form.name,
        lastname: form.lastname,
        phone: form.phone,
        imageUrl: form.imageUrl,
      });
      profile.value = data;
      const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
      if (storedUser) {
        localStorage.setItem('user', JSON.stringify({ ...storedUser, ...data }));
      }
      if (window.__toast) window.__toast.success('Profile updated successfully.');
      return true;
    } catch (err) {
      if (err.response?.status === 404) {
        if (window.__toast) window.__toast.info('Profile update endpoint is not yet available.');
        return false;
      }
      const msg = err.response?.data?.message || err.response?.data?.title || 'Failed to update profile';
      error.value = msg;
      if (window.__toast) window.__toast.error(msg);
      return false;
    } finally {
      saving.value = false;
    }
  }

  onMounted(fetch);

  return { profile, form, loading, saving, error, fetch, save };
}
