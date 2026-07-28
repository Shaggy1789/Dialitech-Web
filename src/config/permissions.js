import { PLANS, ROLES } from './plans';

export function getPlanConfig(planId) {
  return PLANS[planId] || PLANS.free;
}

export function getRoleConfig(role) {
  const normalized = (role || '').toLowerCase();
  return ROLES[normalized] || ROLES.admin;
}

export function hasFeature(planId, feature) {
  const plan = getPlanConfig(planId);
  const module = plan.modules[feature];
  if (!module) return false;
  if (typeof module === 'string') return module === 'available';
  if (typeof module === 'object') return module.status === 'available';
  return false;
}

export function isModuleLocked(planId, feature) {
  const plan = getPlanConfig(planId);
  const module = plan.modules[feature];
  if (!module) return true;
  if (typeof module === 'string') return module === 'locked';
  if (typeof module === 'object') return module.status === 'locked';
  return true;
}

export function isModuleAvailable(planId, role, moduleName) {
  const roleConfig = getRoleConfig(role);
  if (roleConfig.restrictedFrom.includes(moduleName)) return false;
  return hasFeature(planId, moduleName);
}

export function canAccessRoute(planId, role, routeName) {
  const routeModuleMap = {
    dashboard: 'dashboard',
    patients: 'patients',
    'patient-detail': 'patients',
    alerts: 'alerts',
    'user-management': 'administration',
    settings: 'settings',
  };
  const feature = routeModuleMap[routeName];
  if (!feature) return true;
  return isModuleAvailable(planId, role, feature);
}

export function getPatientLimit(planId) {
  const plan = getPlanConfig(planId);
  return plan.limits.patients;
}

export function getUpgradeSuggestion(planId, feature) {
  const planOrder = ['free', 'basic', 'professional', 'enterprise'];
  const currentIndex = planOrder.indexOf(planId);
  for (let i = currentIndex + 1; i < planOrder.length; i++) {
    const candidate = PLANS[planOrder[i]];
    const module = candidate.modules[feature];
    if (module && (module === 'available' || module?.status === 'available')) {
      return candidate;
    }
  }
  return PLANS.enterprise;
}
