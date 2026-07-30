import api from './api';

export const userService = {
  getAll() {
    return api.get('/Users');
  },

  getById(id) {
    return api.get(`/Users/${id}`);
  },

  create(data) {
    return api.post('/Users', data);
  },

  update(id, data) {
    return api.put(`/Users/${id}`);
  },

  delete(id) {
    return api.delete(`/Users/${id}`);
  },
};
