import api from '../api';

export const subscriptionService = {
  get() {
    return api.get('/auth/me');
  },

  changePlan(planId) {
    return api.put('/subscription/plan', { planId });
  },
};
