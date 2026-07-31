import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '../services/auth/auth.service';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));
  const token = ref(localStorage.getItem('token') || '');
  const loading = ref(false);
  const error = ref('');
  const fieldErrors = ref({});

  const isAuthenticated = computed(() => !!token.value);
  const userName = computed(() => user.value?.name || '');
  const userEmail = computed(() => user.value?.email || '');
  const userId = computed(() => user.value?.id || '');
  const photo = computed(() => user.value?.imageUrl || '');
  const fullName = computed(() => {
    const parts = [user.value?.name, user.value?.lastname].filter(Boolean);
    return parts.join(' ') || '';
  });
  const initials = computed(() => {
    const name = fullName.value || userName.value;
    return name
      .split(' ')
      .map((n) => n[0])
      .filter(Boolean)
      .join('')
      .toUpperCase()
      .slice(0, 2);
  });

  function updateUser(patch) {
    if (!user.value) return;
    user.value = { ...user.value, ...patch };
    localStorage.setItem('user', JSON.stringify(user.value));
  }

  function updatePhoto(url) {
    updateUser({ imageUrl: url || '' });
  }

  async function login(email, password) {
    loading.value = true;
    error.value = '';
    fieldErrors.value = {};
    try {
      const { data } = await authService.login({ email, password });
      const caregiver = data.caregiver || data.user || data;
      token.value = data.token;
      user.value = caregiver;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(caregiver));
      return { success: true, caregiver };
    } catch (err) {
      const parsed = authService.extractError(err);
      error.value = parsed.message;
      fieldErrors.value = parsed.fields;
      return { success: false, error: parsed.message, fields: parsed.fields };
    } finally {
      loading.value = false;
    }
  }

  async function register(data) {
    loading.value = true;
    error.value = '';
    fieldErrors.value = {};
    try {
      const { data: responseData } = await authService.register(data);
      return { success: true, data: responseData };
    } catch (err) {
      const parsed = authService.extractError(err);
      error.value = parsed.message;
      fieldErrors.value = parsed.fields;
      return { success: false, error: parsed.message, fields: parsed.fields };
    } finally {
      loading.value = false;
    }
  }

  async function fetchMe() {
    if (!token.value) return;
    try {
      const { data } = await authService.me();
      user.value = data;
      localStorage.setItem('user', JSON.stringify(data));
    } catch {
      logout();
    }
  }

  function clearErrors() {
    error.value = '';
    fieldErrors.value = {};
  }

  function logout() {
    user.value = null;
    token.value = '';
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  return {
    user, token, loading, error, fieldErrors,
    isAuthenticated, userName, userEmail, userId,
    photo, fullName, initials,
    login, register, fetchMe, logout, updateUser, updatePhoto, clearErrors,
  };
});
