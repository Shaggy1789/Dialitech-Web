import { ref, computed, onMounted } from 'vue';
import { subscriptionService } from '../services/settings/subscription.service';
import { PLANS } from '../config/plans';

export function useSubscription() {
  const rawPlan = ref('');
  const loading = ref(true);
  const error = ref('');

  const plan = computed(() => {
    const name = rawPlan.value;
    if (!name) return null;

    const planKey = name.toLowerCase() === 'standard' ? 'free' : name.toLowerCase();
    const config = PLANS[planKey] || PLANS.free;

    return {
      name: name === 'Standard' ? 'Standard' : config.name,
      status: 'Active',
      price: config.price === 0 ? 'Free' : `$${config.price}${config.period}`,
      startDate: null,
      expirationDate: null,
      benefits: config.features,
      features: config.features,
      limits: config.limits,
      modules: config.modules,
    };
  });

  const hasActiveSubscription = computed(() => !!rawPlan.value);

  async function fetch() {
    loading.value = true;
    error.value = '';
    try {
      const { data } = await subscriptionService.get();
      rawPlan.value = data.plan || '';
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.title || 'Failed to load subscription';
      error.value = msg;
      if (window.__toast) window.__toast.error(msg);
    } finally {
      loading.value = false;
    }
  }

  onMounted(fetch);

  return { plan, loading, error, hasActiveSubscription, fetch };
}
