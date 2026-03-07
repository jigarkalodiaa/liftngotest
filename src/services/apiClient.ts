/**
 * Centralized Axios instance (TRD §5).
 * All API calls must go through this client; interceptors handle auth and errors.
 */

import axios, { type AxiosError } from 'axios';
import { API_BASE_URL } from '@/config/env';
import { normalizeApiError } from '@/utils/error';

const apiClient = axios.create({
  baseURL: API_BASE_URL || undefined,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request: add auth token if present (never expose tokens in logs – TRD §14)
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('liftngo_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: normalize errors to user-facing messages
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message = normalizeApiError(error);
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
