import axios from 'axios';

const baseURL = import.meta.env.DEV
  ? '/api/v1'
  : `${import.meta.env.VITE_API_URL}/api/v1`;

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 90000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const IDEMPOTENT_METHODS = ['get', 'head', 'put', 'delete'];
const MAX_RETRIES = 2;
const RETRY_TIMEOUT = 30000;

function isServerUnavailable(error) {
  if (!error.response) return true;
  return error.response.status >= 500;
}

function canRetry(config) {
  const method = (config.method || 'get').toLowerCase();
  if (!IDEMPOTENT_METHODS.includes(method)) return false;
  const retries = config._retryCount || 0;
  if (retries >= MAX_RETRIES) return false;
  config._retryCount = retries + 1;
  return true;
}

function backoffDelay(attempt) {
  return 800 * Math.pow(2, attempt);
}

let lastOfflineToastAt = 0;
let lastFailedConfig = null;

function showServerUnavailableToast() {
  const now = Date.now();
  if (now - lastOfflineToastAt < 60000) return;
  lastOfflineToastAt = now;

  if (!window.__toast) return;

  const title = 'Server not available';
  const message = 'Unable to reach the server. Check your connection and try again.';

  window.__toast.error(title, message, {
    action: {
      label: 'Retry',
      onClick() {
        if (lastFailedConfig) {
          api(lastFailedConfig);
        }
      },
    },
    duration: 0,
  });
}

function onFinalFailure(error, config) {
  lastFailedConfig = config;
  showServerUnavailableToast();
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config || {};

    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      if (isServerUnavailable(error) && canRetry(config)) {
        await new Promise((resolve) => setTimeout(resolve, backoffDelay(config._retryCount)));
        return api({ ...config, timeout: RETRY_TIMEOUT });
      }

      if (isServerUnavailable(error)) {
        onFinalFailure(error, config);
      }
      return Promise.reject(error);
    }

    if (canRetry(config)) {
      await new Promise((resolve) => setTimeout(resolve, backoffDelay(config._retryCount)));
      return api({ ...config, timeout: RETRY_TIMEOUT });
    }

    onFinalFailure(error, config);
    return Promise.reject(error);
  },
);

export default api;
