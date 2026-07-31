import { PLANS, ROLES, PLAN_ORDER } from './plans';

const FALLBACK_PLAN = 'Standard';

export function getPlanConfig(planId) {
  return PLANS[planId] || PLANS[FALLBACK_PLAN];
}

export function getRoleConfig(role) {
  const normalized = (role || '').toLowerCase();
  return ROLES[normalized] || ROLES.caregiver;
}

function moduleStatus(module) {
  if (typeof module === 'string') return module;
  if (module && typeof module === 'object') return module.status || 'locked';
  return 'locked';
}

export function hasFeature(planId, feature) {
  const plan = getPlanConfig(planId);
  const module = plan.modules[feature];
  if (!module) return false;
  return moduleStatus(module) !== 'locked';
}

export function isModuleLocked(planId, feature) {
  return !hasFeature(planId, feature);
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
  return getPlanConfig(planId).limits.patients;
}

export function isFeatureUnlocked(planId, feature) {
  const plan = getPlanConfig(planId);
  if (Object.prototype.hasOwnProperty.call(plan.access, feature)) {
    return plan.access[feature] !== false;
  }
  return hasFeature(planId, feature);
}

export function getUpgradeSuggestion(planId, feature) {
  const currentIndex = PLAN_ORDER.indexOf(planId);
  const start = currentIndex >= 0 ? currentIndex + 1 : 0;
  for (let i = start; i < PLAN_ORDER.length; i++) {
    const candidate = PLANS[PLAN_ORDER[i]];
    if (isFeatureUnlocked(candidate.id, feature)) {
      return candidate;
    }
  }
  return PLANS[PLAN_ORDER[PLAN_ORDER.length - 1]];
}
