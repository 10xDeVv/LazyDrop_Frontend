import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import * as authTokenModule from '@/lib/auth-token';

describe('auth-token module', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('getSupabaseAccessToken', () => {
    it('should retrieve token from localStorage', () => {
      const testToken = 'test_token_12345';
      localStorage.setItem('sb-access-token', testToken);

      const token = authTokenModule.getSupabaseAccessToken();

      expect(token).toBe(testToken);
    });

    it('should return null if token does not exist', () => {
      const token = authTokenModule.getSupabaseAccessToken();

      expect(token).toBeNull();
    });

    it('should retrieve token after setting it', () => {
      const testToken = 'new_token_67890';

      act(() => {
        localStorage.setItem('sb-access-token', testToken);
      });

      const token = authTokenModule.getSupabaseAccessToken();

      expect(token).toBe(testToken);
    });
  });

  describe('setSupabaseAccessToken', () => {
    it('should store token in localStorage', () => {
      const testToken = 'token_to_store';

      authTokenModule.setSupabaseAccessToken(testToken);

      expect(localStorage.getItem('sb-access-token')).toBe(testToken);
    });

    it('should overwrite existing token', () => {
      localStorage.setItem('sb-access-token', 'old_token');

      const newToken = 'new_token_override';
      authTokenModule.setSupabaseAccessToken(newToken);

      expect(localStorage.getItem('sb-access-token')).toBe(newToken);
    });
  });

  describe('clearSupabaseAccessToken', () => {
    it('should remove token from localStorage', () => {
      localStorage.setItem('sb-access-token', 'test_token');

      authTokenModule.clearSupabaseAccessToken();

      expect(localStorage.getItem('sb-access-token')).toBeNull();
    });

    it('should not throw error if token does not exist', () => {
      expect(() => {
        authTokenModule.clearSupabaseAccessToken();
      }).not.toThrow();
    });
  });

  describe('isTokenExpired', () => {
    it('should identify expired token', () => {
      const expiredToken = {
        exp: Math.floor(Date.now() / 1000) - 3600 // 1 hour ago
      };

      const isExpired = authTokenModule.isTokenExpired(expiredToken);

      expect(isExpired).toBe(true);
    });

    it('should identify valid token', () => {
      const validToken = {
        exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour from now
      };

      const isExpired = authTokenModule.isTokenExpired(validToken);

      expect(isExpired).toBe(false);
    });
  });
});
