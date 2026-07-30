import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { PLANS } from '../config/plans';
import { hasFeature, isModuleLocked, isModuleAvailable } from '../config/permissions';

export const useSubscriptionStore = defineStore('subscription', () => {
  const planId = ref('free');
  const role = ref('caregiver');

  const currentPlan = computed(() => PLANS[planId.value] || PLANS.free);
  const isFree = computed(() => planId.value === 'free');
  const isPaid = computed(() => !isFree.value);
  const planName = computed(() => currentPlan.value.name);
  const planPrice = computed(() => currentPlan.value.price);

  const PLAN_MAP = { Standard: 'free', Premium: 'professional', Enterprise: 'enterprise' };

  function setPlan(id) {
    const mapped = PLAN_MAP[id] || id;
    if (PLANS[mapped]) {
      planId.value = mapped;
    }
  }

  function setRole(r) {
    role.value = (r || 'admin').toLowerCase();
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
    planId, role, currentPlan, isFree, isPaid, planName, planPrice,
    setPlan, setRole, can, isLocked, sidebarModules,
  };
});
