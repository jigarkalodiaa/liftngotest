/**
 * Lightweight fetch wrapper used inside axios interceptors to avoid
 * recursive interceptor calls. Mirrors the pattern from CardStack.
 */

export interface HttpRequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  params?: Record<string, any>;
  data?: any;
  headers?: Record<string, string>;
}

export async function fetchHttp<T = any>({
  url,
  method = 'GET',
  params,
  data,
  headers = {},
}: HttpRequestConfig): Promise<T> {
  const queryString = params
    ? '?' +
      Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&')
    : '';

  const response = await fetch(url + queryString, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: ['POST', 'PUT', 'PATCH'].includes(method) ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      message: errorBody.message || response.statusText,
      body: errorBody,
    };
  }

  return response.json();
}
