import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

vi.mock('../../src/services/settings/subscription.service', () => ({
  subscriptionService: {
    changePlan: vi.fn(),
    get: vi.fn(),
  },
}));

import { subscriptionService } from '../../src/services/settings/subscription.service';
import { useSubscriptionStore } from '../../src/stores/subscriptionStore';
import { useAuthStore } from '../../src/stores/authStore';

const token = `h.${Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')}.s`;

function seedAuth(plan = 'Standard') {
  const auth = useAuthStore();
  auth.setSession({
    token,
    caregiver: {
      id: 'u1',
      name: 'Ana',
      email: 'ana@clinic.com',
      plan,
      role: 'caregiver',
      status: 'Active',
    },
  });
  return auth;
}

describe('subscriptionStore (planes y suscripción)', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('por defecto usa el plan Standard', () => {
    const store = useSubscriptionStore();
    expect(store.planId).toBe('Standard');
    expect(store.isBasePlan).toBe(true);
    expect(store.can('ai')).toBe(false);
    expect(store.can('patients')).toBe(true);
  });

  it('setPlan a Pro desbloquea IA', () => {
    const store = useSubscriptionStore();
    store.setPlan('Pro');
    expect(store.planId).toBe('Pro');
    expect(store.isBasePlan).toBe(false);
    expect(store.can('ai')).toBe(true);
    expect(store.isLocked('ai')).toBe(false);
  });

  it('setRole patient oculta settings del sidebar', () => {
    const store = useSubscriptionStore();
    store.setRole('patient');
    const settings = store.sidebarModules.find((m) => m.key === 'settings');
    expect(settings.hidden).toBe(true);
  });

  it('changePlan exitoso actualiza el plan de auth', async () => {
    seedAuth('Standard');
    subscriptionService.changePlan.mockResolvedValue({});
    const store = useSubscriptionStore();
    const auth = useAuthStore();

    const result = await store.changePlan('Pro');

    expect(result.success).toBe(true);
    expect(store.planId).toBe('Pro');
    expect(auth.plan).toBe('Pro');
  });

  it('changePlan con plan desconocido normaliza a Standard y llama al servicio', async () => {
    seedAuth('Pro');
    subscriptionService.changePlan.mockResolvedValue({});
    const store = useSubscriptionStore();

    const result = await store.changePlan('NoExiste');

    expect(result.success).toBe(true);
    // normalizePlanId aplica fallback a Standard: la llamada real usa el plan normalizado
    expect(subscriptionService.changePlan).toHaveBeenCalledWith('Standard');
  });

  it('changePlan captura el error del backend', async () => {
    subscriptionService.changePlan.mockRejectedValue({ response: { data: { message: 'Pago requerido' } } });
    const store = useSubscriptionStore();
    const result = await store.changePlan('Premium');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Pago requerido');
    expect(store.changing).toBe(false);
  });

  it('refreshSubscription sincroniza plan y rol desde el backend', async () => {
    subscriptionService.get.mockResolvedValue({ data: { plan: 'Premium', role: 'admin' } });
    const store = useSubscriptionStore();
    await store.refreshSubscription();
    expect(store.planId).toBe('Premium');
    expect(store.role).toBe('admin');
  });
});