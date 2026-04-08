/**
 * Centralized Axios instance with:
 * - Auto baseURL routing (`/api/*` → same origin, everything else → backend)
 * - Bearer token injection from NextAuth session (via fetchHttp, not axios)
 * - Response envelope unwrapping (`{ success, data }` → `data`)
 * - 401 token refresh with automatic retry, fallback to sign-out
 */

import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS } from '@/config/env';
import { getRefreshTokenUrl } from '@/path';
import { ROUTES } from '@/lib/constants';
import { clearAuthToken, getAuthToken, setAuthToken, setLoggedIn } from '@/lib/storage';
import { AppError, normalizeApiError } from '@/utils/error';
import { fetchHttp } from '@/utils/fetch-http';

const trimmedBase = API_BASE_URL?.trim() ?? '';

export const apiClient = axios.create({
  timeout: API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const url = config.url ?? '';
  if (url.startsWith('/api/')) {
    config.baseURL = '';
  } else {
    config.baseURL = trimmedBase || '';
  }

  if (!config.headers.Authorization && typeof window !== 'undefined') {
    const localToken = getAuthToken();
    if (localToken) {
      config.headers.Authorization = `Bearer ${localToken}`;
    } else {
      try {
        const session = await fetchHttp<{ accessToken?: string }>({
          method: 'GET',
          url: '/api/auth/session',
        });
        if (session?.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
      } catch {
        // No session available — proceed without auth header
      }
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const body = response?.data;
    if (body && typeof body === 'object' && body.success === true && 'data' in body) {
      return body.data;
    }
    return body;
  },
  async (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401 && error.config && typeof window !== 'undefined') {
      try {
        const session = await fetchHttp<{ refreshToken?: string }>({
          method: 'GET',
          url: '/api/auth/session',
        });

        if (session?.refreshToken) {
          const refreshed = await fetchHttp<ApiResponse<{ accessToken: string; refreshToken?: string }>>({
            method: 'POST',
            url: getRefreshTokenUrl(),
            data: { refresh: session.refreshToken },
          });

          const newToken = refreshed?.data?.accessToken;
          if (newToken) {
            setAuthToken(newToken);
            return apiClient({
              ...error.config,
              headers: { ...error.config.headers, Authorization: `Bearer ${newToken}` },
            });
          }
        }
      } catch {
        // Refresh failed — fall through to sign-out
      }

      clearAuthToken();
      setLoggedIn(false);
      const loginPath = ROUTES.LOGIN;
      if (!window.location.pathname.startsWith(loginPath)) {
        const next = encodeURIComponent(`${window.location.pathname}${window.location.search}`);
        window.location.assign(`${loginPath}?from=session&next=${next}`);
      }
    }

    const message = normalizeApiError(error);
    return Promise.reject(new AppError(message, undefined, status, error));
  },
);

export default apiClient;
