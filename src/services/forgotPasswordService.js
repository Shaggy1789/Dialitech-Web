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
    return api.post('/api/auth/forgot-password', data);
  },

  verifyCode(data) {
    /*
      data = { code: string, method: string, value: string }
      POST /api/auth/verify-code
    */
    return api.post('/api/auth/verify-code', data);
  },

  resetPassword(data) {
    /*
      data = { token: string, newPassword: string, confirmPassword: string }
      POST /api/auth/reset-password
    */
    return api.post('/api/auth/reset-password', data);
  },
};
