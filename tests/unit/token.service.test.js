import { describe, it, expect, beforeEach } from 'vitest';
import tokenService, {
  decodeToken,
  getExpiryTime,
  isTokenValid,
} from '../../src/services/token.service';
import { STORAGE_KEYS, AUTH_CONFIG } from '../../src/config/security';

describe('token.service (almacenamiento seguro del JWT)', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('usa sessionStorage (no localStorage) como almacén del token', () => {
    expect(AUTH_CONFIG.TOKEN_STORAGE).toBe('sessionStorage');
    tokenService.setToken('jwt.abc.123');
    expect(sessionStorage.getItem(STORAGE_KEYS.TOKEN)).toBe('jwt.abc.123');
    expect(localStorage.getItem(STORAGE_KEYS.TOKEN)).toBeNull();
  });

  it('getToken devuelve el token almacenado', () => {
    tokenService.setToken('un-token');
    expect(tokenService.getToken()).toBe('un-token');
  });

  it('removeToken limpia el almacén', () => {
    tokenService.setToken('un-token');
    tokenService.removeToken();
    expect(tokenService.getToken()).toBe('');
  });

  it('setToken sin valor limpia el almacén', () => {
    tokenService.setToken('un-token');
    tokenService.setToken('');
    expect(tokenService.getToken()).toBe('');
  });

  it('guarda y recupera el usuario', () => {
    const user = { id: 'u1', name: 'Ana', email: 'ana@x.com' };
    tokenService.setStoredUser(user);
    expect(tokenService.getStoredUser()).toEqual(user);
  });

  it('getStoredUser devuelve null si el JSON es inválido', () => {
    sessionStorage.setItem(STORAGE_KEYS.USER, 'not-json{');
    expect(tokenService.getStoredUser()).toBeNull();
  });

  it('clearAuthStorage elimina token y usuario', () => {
    tokenService.setToken('t');
    tokenService.setStoredUser({ id: 'u1' });
    tokenService.clearAuthStorage();
    expect(tokenService.getToken()).toBe('');
    expect(tokenService.getStoredUser()).toBeNull();
  });

  it('decodeToken decodifica el payload sin verificar firma', () => {
    const b64 = Buffer.from(JSON.stringify({ exp: 9999999999, email: 'a@b.com' })).toString('base64url');
    const token = `header.${b64}.signature`;
    expect(decodeToken(token)).toEqual({ exp: 9999999999, email: 'a@b.com' });
  });

  it('decodeToken devuelve null para tokens malformados', () => {
    expect(decodeToken('')).toBeNull();
    expect(decodeToken('solo.dos')).toBeNull();
    expect(decodeToken('a.b.%%%')).toBeNull();
  });

  it('getExpiryTime convierte exp (segundos) a ms', () => {
    expect(getExpiryTime({ exp: 1000 })).toBe(1000 * 1000);
    expect(getExpiryTime({})).toBeNull();
  });

  it('isTokenValid valida expiración con tolerancia de reloj', () => {
    const expiredPayload = { exp: Math.floor(Date.now() / 1000) - 120 };
    const validPayload = { exp: Math.floor(Date.now() / 1000) + 3600 };
    const expired = `a.${Buffer.from(JSON.stringify(expiredPayload)).toString('base64url')}.b`;
    const valid = `a.${Buffer.from(JSON.stringify(validPayload)).toString('base64url')}.b`;
    tokenService.setToken(expired);
    expect(isTokenValid()).toBe(false);
    tokenService.setToken(valid);
    expect(isTokenValid()).toBe(true);
  });
});