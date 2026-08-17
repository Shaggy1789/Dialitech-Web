import { describe, it, expect } from 'vitest';
import {
  normalizePlanId,
  normalizeRole,
  hasFeature,
  isFeatureUnlocked,
  roleAllows,
  canAccess,
  canEdit,
  canDelete,
  canView,
  getUpgradeSuggestion,
} from '../../src/services/permission.service';

describe('permission.service (planes y permisos)', () => {
  describe('normalizePlanId', () => {
    it('resuelve aliases a los IDs de backend', () => {
      expect(normalizePlanId('free')).toBe('Standard');
      expect(normalizePlanId('pro')).toBe('Pro');
      expect(normalizePlanId('premium')).toBe('Premium');
      expect(normalizePlanId('enterprise')).toBe('Premium');
    });

    it('mantiene IDs válidos y aplica fallback', () => {
      expect(normalizePlanId('Pro')).toBe('Pro');
      expect(normalizePlanId(undefined)).toBe('Standard');
      expect(normalizePlanId('no-existe')).toBe('Standard');
    });
  });

  describe('normalizeRole', () => {
    it('reconoce roles válidos y aplica caregiver como fallback', () => {
      expect(normalizeRole('admin')).toBe('admin');
      expect(normalizeRole('caregiver')).toBe('caregiver');
      expect(normalizeRole('patient')).toBe('patient');
      expect(normalizeRole('hacker')).toBe('caregiver');
      expect(normalizeRole(undefined)).toBe('caregiver');
    });
  });

  describe('hasFeature / isFeatureUnlocked', () => {
    it('el plan Standard no tiene IA ni reportes avanzados', () => {
      expect(hasFeature('Standard', 'ai')).toBe(false);
      expect(isFeatureUnlocked('Standard', 'ai')).toBe(false);
      expect(hasFeature('Standard', 'patients')).toBe(true);
      expect(hasFeature('Standard', 'statistics')).toBe(false);
    });

    it('Pro y Premium habilitan IA y administración', () => {
      expect(hasFeature('Pro', 'ai')).toBe(true);
      expect(hasFeature('Premium', 'ai')).toBe(true);
      expect(hasFeature('Pro', 'administration')).toBe(true);
      expect(hasFeature('Premium', 'administration')).toBe(true);
    });

    it('feature inexistente -> false', () => {
      expect(hasFeature('Standard', 'timeTravel')).toBe(false);
    });
  });

  describe('roleAllows', () => {
    it('patient no accede a settings/administration/users', () => {
      expect(roleAllows('patient', 'dashboard')).toBe(true);
      expect(roleAllows('patient', 'settings')).toBe(false);
      expect(roleAllows('patient', 'administration')).toBe(false);
    });

    it('caregiver y admin acceden a todos los módulos', () => {
      expect(roleAllows('caregiver', 'settings')).toBe(true);
      expect(roleAllows('admin', 'administration')).toBe(true);
    });
  });

  describe('canAccess / can / canEdit / canDelete / canView', () => {
    it('requiere rol y plan', () => {
      expect(canAccess('Standard', 'caregiver', 'patients')).toBe(true);
      expect(canAccess('Standard', 'caregiver', 'ai')).toBe(false);
      expect(canAccess('Pro', 'patient', 'settings')).toBe(false);
    });

    it('can delete depende de administration/settings del plan', () => {
      expect(canDelete('Pro', 'caregiver', 'patients')).toBe(true);
      expect(canDelete('Standard', 'caregiver', 'patients')).toBe(true); // settings disponible
      expect(canDelete('Standard', 'caregiver', 'ai')).toBe(false); // sin acceso al módulo
    });

    it('canEdit/canView = acceso al módulo', () => {
      expect(canEdit('Pro', 'caregiver', 'patients')).toBe(true);
      expect(canView('Standard', 'caregiver', 'patients')).toBe(true);
      expect(canEdit('Standard', 'caregiver', 'ai')).toBe(false);
    });
  });

  describe('getUpgradeSuggestion', () => {
    it('sugiere Pro para IA desde Standard', () => {
      const suggestion = getUpgradeSuggestion('Standard', 'ai');
      expect(suggestion.id).toBe('Pro');
    });

    it('sugiere Premium para exports desde Pro', () => {
      const suggestion = getUpgradeSuggestion('Pro', 'exports');
      expect(suggestion.id).toBe('Premium');
    });

    it('desde Premium devuelve Premium (ya es el máximo)', () => {
      expect(getUpgradeSuggestion('Premium', 'ai').id).toBe('Premium');
    });
  });
});