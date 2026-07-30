import api from './api';

export const forgotPasswordService = {
  sendRecoveryCode(data) {
    /*
      data = { method: 'email' | 'phone', value: string }
      POST /api/auth/forgot-password
      Body:
        { "method": "email", "value": "user@email.com" }
        { "method": "phone", "value": "+521234567890" }
    */
    return api.post('/auth/forgot-password', data);
  },

  verifyCode(data) {
    return api.post('/auth/verify-code', data);
  },

  resetPassword(data) {
    return api.post('/auth/reset-password', data);
  },
};
