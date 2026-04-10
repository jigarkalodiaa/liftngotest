/**
 * API Types - Centralized type definitions for API layer
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, unknown>;
}

export interface RequestConfig {
  /** Skip auth token injection */
  skipAuth?: boolean;
  /** Number of retry attempts (default: 3 for GET, 0 for mutations) */
  retries?: number;
  /** Retry delay in ms (default: 1000) */
  retryDelay?: number;
  /** Request timeout in ms */
  timeout?: number;
  /** Custom headers */
  headers?: Record<string, string>;
  /** Signal for request cancellation */
  signal?: AbortSignal;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestOptions<TBody = unknown> extends RequestConfig {
  method: HttpMethod;
  url: string;
  data?: TBody;
  params?: Record<string, string | number | boolean | undefined>;
}
