import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '../services/auth/auth.service';
import { useSubscriptionStore } from './subscriptionStore';

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

  function initSubscription() {
    const sub = useSubscriptionStore();
    if (user.value?.plan) sub.setPlan(user.value.plan);
    if (user.value?.role) sub.setRole(user.value.role);
  }

  initSubscription();

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
      initSubscription();
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
      initSubscription();
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
    const sub = useSubscriptionStore();
    sub.setPlan('free');
    sub.setRole('caregiver');
  }

  return {
    user, token, loading, error, fieldErrors,
    isAuthenticated, userName, userEmail, userId,
    login, register, fetchMe, logout, initSubscription, clearErrors,
  };
});
