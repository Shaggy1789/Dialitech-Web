import { describe, it, expect } from 'vitest';
import {
  isEmail,
  isPhone,
  isStrongPassword,
  required,
  matches,
  sanitizeEmail,
  sanitizeString,
  validateLoginForm,
  validateRegisterForm,
  validateProfileForm,
} from '../../src/utils/validators';

describe('validators (política de contraseñas y formularios)', () => {
  describe('isStrongPassword', () => {
    it('acepta contraseñas que cumplen la política', () => {
      expect(isStrongPassword('Abcdef1!')).toBe(true);
      expect(isStrongPassword('Passw0rd!')).toBe(true);
    });

    it('rechaza contraseñas sin mayúscula, dígito o especial', () => {
      expect(isStrongPassword('abcdef1!')).toBe(false); // sin mayúscula
      expect(isStrongPassword('Abcdefg!')).toBe(false); // sin dígito
      expect(isStrongPassword('Abcdef1a')).toBe(false); // sin especial
    });

    it('rechaza espacios y longitudes fuera de rango', () => {
      expect(isStrongPassword('Abc 123!')).toBe(false);
      expect(isStrongPassword('Ab1!')).toBe(false); // muy corta
    });
  });

  describe('isEmail / isPhone', () => {
    it('valida correos', () => {
      expect(isEmail('ana@clinic.com')).toBe(true);
      expect(isEmail('no-es-correo')).toBe(false);
      expect(isEmail('')).toBe(false);
    });

    it('valida teléfonos (vacío permitido como opcional)', () => {
      expect(isPhone('+52 55 1234 5678')).toBe(true);
      expect(isPhone('')).toBe(true);
      expect(isPhone('abc')).toBe(false);
    });
  });

  describe('sanitize', () => {
    it('sanitizeEmail normaliza a minúsculas y recorta', () => {
      expect(sanitizeEmail('  Ana@Clinic.COM  ')).toBe('ana@clinic.com');
    });

    it('sanitizeString colapsa espacios y limita longitud', () => {
      expect(sanitizeString('  Ana   María ', 10)).toBe('Ana María');
    });
  });

  describe('validateLoginForm', () => {
    it('valida login válido sin errores', () => {
      expect(validateLoginForm({ email: 'ana@clinic.com', password: 'Abcdef1!' })).toEqual({});
    });

    it('rechaza login con email inválido y contraseña corta', () => {
      const errors = validateLoginForm({ email: 'malo', password: '123' });
      expect(errors.email).toBeTruthy();
      expect(errors.password).toBeTruthy();
    });
  });

  describe('validateRegisterForm', () => {
    it('valida registro válido', () => {
      const form = {
        name: 'Ana',
        lastname: 'García',
        email: 'ana@clinic.com',
        phone: '+52 55 1234 5678',
        password: 'Abcdef1!',
        confirmPassword: 'Abcdef1!',
      };
      expect(validateRegisterForm(form)).toEqual({});
    });

    it('detecta contraseñas que no coinciden y password débil', () => {
      const form = {
        name: 'Ana',
        lastname: 'García',
        email: 'ana@clinic.com',
        phone: '+52 55 1234 5678',
        password: 'Abcdef1!',
        confirmPassword: 'Otra123!',
      };
      const errors = validateRegisterForm(form);
      expect(errors.confirmPassword).toBeTruthy();

      const weak = { ...form, password: 'abc', confirmPassword: 'abc' };
      expect(validateRegisterForm(weak).password).toBeTruthy();
    });

    it('valida que confirmPassword sea obligatoria', () => {
      const form = {
        name: 'Ana',
        lastname: 'García',
        email: 'ana@clinic.com',
        phone: '+52 55 1234 5678',
        password: 'Abcdef1!',
      };
      expect(validateRegisterForm(form).confirmPassword).toBeTruthy();
    });
  });

  describe('validateProfileForm', () => {
    it('acepta teléfono opcional vacío y valida cuando viene', () => {
      expect(validateProfileForm({ name: 'Ana', lastname: 'García', phone: '' })).toEqual({});
      expect(validateProfileForm({ name: 'Ana', lastname: 'García', phone: 'no' }).phone).toBeTruthy();
    });
  });

  describe('helpers', () => {
    it('required/matches', () => {
      expect(required('x')).toBe(true);
      expect(required('  ')).toBe(false);
      expect(matches('a', 'a')).toBe(true);
      expect(matches('a', 'b')).toBe(false);
    });
  });
});