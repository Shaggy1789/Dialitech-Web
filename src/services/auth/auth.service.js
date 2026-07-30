import api from '../api';

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

  sendRecoveryCode(data) {
    return api.post('/auth/forgot-password', data);
  },

  verifyCode(data) {
    return api.post('/auth/verify-code', data);
  },

  resetPassword(data) {
    return api.post('/auth/reset-password', data);
  },
};
