import api from './api';

export const userService = {
  getAll() {
    return api.get('/api/Users');
  },

  getById(id) {
    return api.get(`/api/Users/${id}`);
  },

  create(data) {
    return api.post('/api/Users', data);
  },

  update(id, data) {
    return api.put(`/api/Users/${id}`, data);
  },

  delete(id) {
    return api.delete(`/api/Users/${id}`);
  },
};
