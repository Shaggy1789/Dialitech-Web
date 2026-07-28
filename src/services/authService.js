import api from './api';

export const authService = {
  register(data) {
    return api.post('/api/Auth/register', data);
  },

  login(data) {
    return api.post('/api/Auth/login', data);
  },

  me() {
    return api.get('/api/Auth/me');
  },
};
