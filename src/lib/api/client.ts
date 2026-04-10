/**
 * Production-grade API Client
 * 
 * Features:
 * - Automatic retry with exponential backoff
 * - Request/response interceptors
 * - Auth token injection
 * - Request cancellation
 * - Proper error handling
 * - Request deduplication for GET requests
 */

import { API_BASE_URL, API_TIMEOUT_MS } from '@/config/env';
import { getAuthToken, setAuthToken, clearAuthToken, setLoggedIn } from '@/lib/storage';
import { ROUTES } from '@/lib/constants';
import { ApiError, NetworkError, TimeoutError, AuthenticationError, parseApiError, isRetryableError } from './errors';
import type { ApiRequestOptions, ApiResponse, RequestConfig } from './types';

// Configuration
const DEFAULT_TIMEOUT = API_TIMEOUT_MS || 20000;
const DEFAULT_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 1000;
const MAX_RETRY_DELAY = 10000;

// In-flight request cache for deduplication
const inflightRequests = new Map<string, Promise<unknown>>();

// Logger (only in development)
const isDev = process.env.NODE_ENV === 'development';
const log = {
  request: (method: string, url: string) => isDev && console.log(`[API] ${method} ${url}`),
  response: (method: string, url: string, status: number) => isDev && console.log(`[API] ${method} ${url} → ${status}`),
  error: (method: string, url: string, error: unknown) => isDev && console.error(`[API] ${method} ${url} failed:`, error),
  retry: (attempt: number, maxRetries: number) => isDev && console.log(`[API] Retry ${attempt}/${maxRetries}`),
};

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay
 */
function getRetryDelay(attempt: number, baseDelay: number): number {
  const delay = baseDelay * Math.pow(2, attempt - 1);
  // Add jitter (±20%)
  const jitter = delay * 0.2 * (Math.random() * 2 - 1);
  return Math.min(delay + jitter, MAX_RETRY_DELAY);
}

/**
 * Generate cache key for request deduplication
 */
function getCacheKey(method: string, url: string, params?: Record<string, unknown>): string {
  const paramStr = params ? JSON.stringify(params) : '';
  return `${method}:${url}:${paramStr}`;
}

/**
 * Build full URL with query parameters
 */
function buildUrl(baseUrl: string, path: string, params?: Record<string, string | number | boolean | undefined>): string {
  const url = new URL(path, baseUrl || window.location.origin);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  
  return url.toString();
}

/**
 * Get auth headers
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = getAuthToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

/**
 * Handle 401 - attempt token refresh
 */
async function handleUnauthorized(): Promise<boolean> {
  try {
    // Try to refresh token
    const response = await fetch('/api/auth/session', { credentials: 'include' });
    if (response.ok) {
      const session = await response.json();
      if (session?.accessToken) {
        setAuthToken(session.accessToken);
        return true;
      }
    }
  } catch {
    // Refresh failed
  }
  
  // Clear auth and redirect to login
  clearAuthToken();
  setLoggedIn(false);
  
  if (typeof window !== 'undefined' && !window.location.pathname.startsWith(ROUTES.LOGIN)) {
    const next = encodeURIComponent(`${window.location.pathname}${window.location.search}`);
    window.location.assign(`${ROUTES.LOGIN}?from=session&next=${next}`);
  }
  
  return false;
}

/**
 * Core fetch wrapper with retry logic
 */
async function fetchWithRetry<T>(
  options: ApiRequestOptions,
  config: RequestConfig = {}
): Promise<T> {
  const {
    method,
    url,
    data,
    params,
    skipAuth = false,
    retries = method === 'GET' ? DEFAULT_RETRIES : 0,
    retryDelay = DEFAULT_RETRY_DELAY,
    timeout = DEFAULT_TIMEOUT,
    headers: customHeaders = {},
    signal,
  } = { ...options, ...config };

  // Determine base URL
  const isInternalApi = url.startsWith('/api/');
  const baseUrl = isInternalApi ? '' : (API_BASE_URL?.trim() || '');
  const fullUrl = buildUrl(baseUrl, url, params);

  // Build headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };

  if (!skipAuth) {
    const authHeaders = await getAuthHeaders();
    Object.assign(headers, authHeaders);
  }

  // Request options
  const fetchOptions: RequestInit = {
    method,
    headers,
    credentials: 'include',
    signal,
  };

  if (data && method !== 'GET') {
    fetchOptions.body = JSON.stringify(data);
  }

  let lastError: ApiError | null = null;
  let attempt = 0;

  while (attempt <= retries) {
    attempt++;

    try {
      log.request(method, url);

      // Create timeout controller
      const timeoutController = new AbortController();
      const timeoutId = setTimeout(() => timeoutController.abort(), timeout);

      // Combine with external signal if provided
      const combinedSignal = signal
        ? AbortSignal.any([signal, timeoutController.signal])
        : timeoutController.signal;

      const response = await fetch(fullUrl, {
        ...fetchOptions,
        signal: combinedSignal,
      });

      clearTimeout(timeoutId);

      log.response(method, url, response.status);

      // Handle 401 - try refresh once
      if (response.status === 401 && !skipAuth) {
        const refreshed = await handleUnauthorized();
        if (refreshed && attempt <= retries) {
          // Retry with new token
          const newAuthHeaders = await getAuthHeaders();
          Object.assign(headers, newAuthHeaders);
          continue;
        }
        throw new AuthenticationError();
      }

      // Parse response
      const contentType = response.headers.get('content-type');
      let responseData: unknown;

      if (contentType?.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      // Handle error responses
      if (!response.ok) {
        const errorData = responseData as Record<string, unknown>;
        throw parseApiError({
          response: {
            status: response.status,
            data: errorData,
            headers: Object.fromEntries(response.headers.entries()),
          },
          message: errorData?.message || errorData?.error || `Request failed with status ${response.status}`,
        });
      }

      // Unwrap API envelope if present
      if (
        typeof responseData === 'object' &&
        responseData !== null &&
        'success' in responseData &&
        'data' in responseData
      ) {
        const envelope = responseData as ApiResponse<T>;
        if (envelope.success) {
          return envelope.data;
        }
        throw parseApiError({
          response: { status: 400, data: envelope },
          message: envelope.message || envelope.error || 'Request failed',
        });
      }

      return responseData as T;
    } catch (error) {
      log.error(method, url, error);

      // Handle abort/timeout
      if (error instanceof DOMException && error.name === 'AbortError') {
        lastError = new TimeoutError();
      } else if (error instanceof TypeError) {
        lastError = new NetworkError(undefined, error);
      } else {
        lastError = parseApiError(error);
      }

      // Check if we should retry
      const shouldRetry = attempt <= retries && isRetryableError(lastError);

      if (shouldRetry) {
        const delay = getRetryDelay(attempt, retryDelay);
        log.retry(attempt, retries);
        await sleep(delay);
        continue;
      }

      throw lastError;
    }
  }

  throw lastError || new ApiError('Request failed after retries');
}

/**
 * API Client with request deduplication for GET requests
 */
export const apiClient = {
  async get<T>(url: string, params?: Record<string, string | number | boolean | undefined>, config?: RequestConfig): Promise<T> {
    const cacheKey = getCacheKey('GET', url, params);
    
    // Return existing in-flight request if present
    const existing = inflightRequests.get(cacheKey);
    if (existing) {
      return existing as Promise<T>;
    }

    const request = fetchWithRetry<T>({ method: 'GET', url, params }, config).finally(() => {
      inflightRequests.delete(cacheKey);
    });

    inflightRequests.set(cacheKey, request);
    return request;
  },

  async post<T, D = unknown>(url: string, data?: D, config?: RequestConfig): Promise<T> {
    return fetchWithRetry<T>({ method: 'POST', url, data }, config);
  },

  async put<T, D = unknown>(url: string, data?: D, config?: RequestConfig): Promise<T> {
    return fetchWithRetry<T>({ method: 'PUT', url, data }, config);
  },

  async patch<T, D = unknown>(url: string, data?: D, config?: RequestConfig): Promise<T> {
    return fetchWithRetry<T>({ method: 'PATCH', url, data }, config);
  },

  async delete<T>(url: string, config?: RequestConfig): Promise<T> {
    return fetchWithRetry<T>({ method: 'DELETE', url }, config);
  },
};

export default apiClient;
