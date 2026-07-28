import api from './api';

export const alertService = {
  getByUser(userId) {
    return api.get(`/api/alerts/${userId}`);
  },
};
