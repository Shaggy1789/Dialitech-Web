import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '../services/authService';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'));
  const token = ref(localStorage.getItem('token') || '');
  const loading = ref(false);
  const error = ref('');

  const isAuthenticated = computed(() => !!token.value);
  const userName = computed(() => user.value?.name || '');
  const userEmail = computed(() => user.value?.email || '');
  const userId = computed(() => user.value?.id || '');

  async function login(email, password) {
    loading.value = true;
    error.value = '';
    try {
      const { data } = await authService.login({ email, password });
      token.value = data.token;
      user.value = data.user;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function register(data) {
    loading.value = true;
    error.value = '';
    try {
      const response = await authService.register(data);
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Registration failed';
      throw err;
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

  function logout() {
    user.value = null;
    token.value = '';
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  return {
    user, token, loading, error,
    isAuthenticated, userName, userEmail, userId,
    login, register, fetchMe, logout,
  };
});
