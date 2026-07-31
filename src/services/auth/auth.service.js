import api from '../api';

function extractError(err) {
  if (err.response?.data) {
    const data = err.response.data;
    if (typeof data === 'string') return { message: data, fields: {} };
    if (data.errors) {
      const fields = {};
      for (const [key, msgs] of Object.entries(data.errors)) {
        fields[key.toLowerCase()] = Array.isArray(msgs) ? msgs[0] : msgs;
      }
      return { message: data.title || 'Validation failed', fields };
    }
    if (data.message) return { message: data.message, fields: {} };
    return { message: data.title || 'Request failed', fields: {} };
  }
  if (err.message === 'Network Error') {
    return { message: 'Something went wrong. Please try again later.', fields: {} };
  }
  return { message: err.message || 'Something went wrong. Please try again later.', fields: {} };
}

export const authService = {
  login(data) {
    return api.post('/auth/login', data);
  },

  register(data) {
    return api.post('/auth/register', data);
  },

  me() {
    return api.get('/auth/me');
  },

  updateProfile(data) {
    return api.put('/auth/profile', data);
  },

  deleteAccount() {
    return api.delete('/auth/account');
  },

  changePassword(data) {
    return api.post('/auth/change-password', data);
  },

  sendRecoveryCode(data) {
    return api.post('/auth/forgot-password', data);
  },

  resetPassword(data) {
    return api.post('/auth/reset-password', data);
  },

  extractError,
};
