/**
 * API Layer - Public exports
 */

export { apiClient, default } from './client';
export {
  ApiError,
  NetworkError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ValidationError,
  RateLimitError,
  ServerError,
  TimeoutError,
  parseApiError,
  getErrorMessage,
  isRetryableError,
} from './errors';
export type {
  ApiResponse,
  ApiError as ApiErrorType,
  RequestConfig,
  PaginatedResponse,
  PaginationParams,
  HttpMethod,
  ApiRequestOptions,
} from './types';
