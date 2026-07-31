import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { PLANS } from '../config/plans';
import { hasFeature, isModuleLocked, isModuleAvailable } from '../config/permissions';
import { subscriptionService } from '../services/settings/subscription.service';

export const useSubscriptionStore = defineStore('subscription', () => {
  const planId = ref('free');
  const role = ref('caregiver');
  const changing = ref(false);

  const currentPlan = computed(() => PLANS[planId.value] || PLANS.free);
  const isFree = computed(() => planId.value === 'free');
  const isPaid = computed(() => !isFree.value);
  const planName = computed(() => currentPlan.value.name);
  const planPrice = computed(() => currentPlan.value.price);

  const availablePlans = computed(() => {
    return Object.values(PLANS).map((plan) => {
      const isCurrent = plan.id === planId.value;
      const patientsLimit = plan.limits?.patients ?? 0;
      const caregiversLimit = plan.limits?.caregivers ?? 0;
      const alertsPerDay = plan.limits?.alertsPerDay ?? 0;

      return {
        ...plan,
        isCurrent,
        patientsLimit: patientsLimit === -1 ? 'Unlimited' : patientsLimit,
        caregiversLimit: caregiversLimit === -1 ? 'Unlimited' : caregiversLimit,
        alertsPerDay: alertsPerDay === -1 ? 'Unlimited' : alertsPerDay,
        devicesAllowed: plan.modules?.patients?.max === -1 ? 'Unlimited' : (plan.modules?.patients?.max ?? 0),
        reportsAvailable: plan.modules?.reports === 'available',
        advancedMonitoring: plan.modules?.advancedMonitoring === 'available',
        statistics: plan.modules?.statistics === 'available',
        apiAccess: plan.modules?.apiAccess === 'available',
        teamCollaboration: plan.modules?.administration === 'available',
      };
    });
  });

  const PLAN_MAP = { Standard: 'free', Pro: 'professional', Premium: 'enterprise' };
  const PLAN_MAP_REVERSE = { free: 'Standard', basic: 'Standard', professional: 'Pro', enterprise: 'Premium' };

  function setPlan(id) {
    const mapped = PLAN_MAP[id] || id;
    if (PLANS[mapped]) {
      planId.value = mapped;
    }
  }

  function setRole(r) {
    role.value = (r || 'caregiver').toLowerCase();
  }

  async function changePlan(newPlanId) {
    changing.value = true;
    try {
      await subscriptionService.changePlan(newPlanId);
      planId.value = newPlanId;
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (user) {
        user.plan = PLAN_MAP_REVERSE[newPlanId] || newPlanId;
        localStorage.setItem('user', JSON.stringify(user));
      }
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.title || 'Failed to change plan';
      if (err.response?.status === 404) {
        planId.value = newPlanId;
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (user) {
          user.plan = PLAN_MAP_REVERSE[newPlanId] || newPlanId;
          localStorage.setItem('user', JSON.stringify(user));
        }
        return { success: true, offline: true };
      }
      return { success: false, error: msg };
    } finally {
      changing.value = false;
    }
  }

  async function refreshSubscription() {
    try {
      const { data } = await subscriptionService.get();
      if (data.plan) setPlan(data.plan);
      if (data.role) setRole(data.role);
    } catch {
    }
  }

  function can(feature) {
    return isModuleAvailable(planId.value, role.value, feature);
  }

  function isLocked(feature) {
    const roleConfig = { patient: { restrictedFrom: ['settings', 'administration'] }, caregiver: { restrictedFrom: [] }, admin: { restrictedFrom: [] } };
    const r = roleConfig[role.value] || roleConfig.admin;
    if (r.restrictedFrom.includes(feature)) return true;
    return isModuleLocked(planId.value, feature);
  }

  const sidebarModules = computed(() => {
    const modules = [
      { key: 'dashboard', label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
      { key: 'patients', label: 'Patients', route: '/patients', icon: 'patients' },
      { key: 'alerts', label: 'Alerts', route: '/alerts', icon: 'alerts' },
      { key: 'settings', label: 'Settings', route: '/settings', icon: 'settings' },
    ];
    return modules.map((m) => ({
      ...m,
      locked: isLocked(m.key),
      hidden: role.value === 'patient' && m.key === 'administration',
    }));
  });

  return {
    planId, role, currentPlan, isFree, isPaid, planName, planPrice, changing,
    availablePlans,
    setPlan, setRole, changePlan, refreshSubscription,
    can, isLocked, sidebarModules,
  };
});
