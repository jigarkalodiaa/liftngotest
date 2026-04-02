'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  getAuthToken,
  isUserAuthenticated,
  performFullClientLogout,
  setLoggedIn,
  clearAuthToken,
} from '@/lib/storage';

/**
 * Client auth snapshot (sessionStorage token + logged-in flag).
 * Syncs on mount and window focus.
 */
export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const sync = useCallback(() => {
    if (typeof window === 'undefined') return;
    setAuthenticated(isUserAuthenticated());
    setToken(getAuthToken());
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener('focus', sync);
    return () => {
      window.removeEventListener('focus', sync);
    };
  }, [sync]);

  const logout = useCallback(() => {
    performFullClientLogout();
    sync();
  }, [sync]);

  const clearSession = useCallback(() => {
    clearAuthToken();
    setLoggedIn(false);
    sync();
  }, [sync]);

  return {
    authenticated,
    token,
    logout,
    clearSession,
    refresh: sync,
  };
}
