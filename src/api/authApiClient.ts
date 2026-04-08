/**
 * Axios client for public auth endpoints (send-otp, resend-otp).
 * No Bearer token — these are unauthenticated requests.
 * Response envelope unwrapping matches the main apiClient pattern.
 */

import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { getPublicAuthApiBase } from '@/config/authPublic';
import { API_TIMEOUT_MS } from '@/config/env';
import { AppError, normalizeApiError } from '@/utils/error';

export const authApiClient = axios.create({
  timeout: API_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
});

authApiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const base = getPublicAuthApiBase();
  config.baseURL = base || undefined;
  return config;
});

authApiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const body = response?.data;
    if (body && typeof body === 'object' && body.success === true && 'data' in body) {
      return body.data;
    }
    return body;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const message = normalizeApiError(error);
    return Promise.reject(new AppError(message, undefined, status, error));
  },
);
