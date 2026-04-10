/**
 * API Error Classes - Structured error handling
 */

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;
  public readonly isRetryable: boolean;
  public readonly originalError?: unknown;

  constructor(
    message: string,
    status: number = 500,
    code: string = 'UNKNOWN_ERROR',
    isRetryable: boolean = false,
    originalError?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.isRetryable = isRetryable;
    this.originalError = originalError;

    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      isRetryable: this.isRetryable,
    };
  }
}

export class NetworkError extends ApiError {
  constructor(message: string = 'Network error. Please check your connection.', originalError?: unknown) {
    super(message, 0, 'NETWORK_ERROR', true, originalError);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication failed. Please login again.', originalError?: unknown) {
    super(message, 401, 'AUTHENTICATION_ERROR', false, originalError);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = 'You do not have permission to perform this action.', originalError?: unknown) {
    super(message, 403, 'AUTHORIZATION_ERROR', false, originalError);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'The requested resource was not found.', originalError?: unknown) {
    super(message, 404, 'NOT_FOUND', false, originalError);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends ApiError {
  public readonly fields?: Record<string, string[]>;

  constructor(
    message: string = 'Validation failed.',
    fields?: Record<string, string[]>,
    originalError?: unknown
  ) {
    super(message, 400, 'VALIDATION_ERROR', false, originalError);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

export class RateLimitError extends ApiError {
  public readonly retryAfter?: number;

  constructor(message: string = 'Too many requests. Please try again later.', retryAfter?: number, originalError?: unknown) {
    super(message, 429, 'RATE_LIMIT', true, originalError);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class ServerError extends ApiError {
  constructor(message: string = 'Server error. Please try again later.', originalError?: unknown) {
    super(message, 500, 'SERVER_ERROR', true, originalError);
    this.name = 'ServerError';
  }
}

export class TimeoutError extends ApiError {
  constructor(message: string = 'Request timed out. Please try again.', originalError?: unknown) {
    super(message, 408, 'TIMEOUT', true, originalError);
    this.name = 'TimeoutError';
  }
}

/**
 * Parse error from various sources into ApiError
 */
export function parseApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    // Network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return new NetworkError(undefined, error);
    }
    if (error.name === 'AbortError') {
      return new TimeoutError('Request was cancelled.', error);
    }
    return new ApiError(error.message, 500, 'UNKNOWN_ERROR', false, error);
  }

  // Axios-like error structure
  if (typeof error === 'object' && error !== null) {
    const err = error as Record<string, unknown>;
    const response = err.response as Record<string, unknown> | undefined;
    const status = (response?.status as number) ?? 500;
    const data = response?.data as Record<string, unknown> | undefined;
    const message = (data?.message as string) ?? (err.message as string) ?? 'An error occurred';

    switch (status) {
      case 400:
        return new ValidationError(message, data?.errors as Record<string, string[]>, error);
      case 401:
        return new AuthenticationError(message, error);
      case 403:
        return new AuthorizationError(message, error);
      case 404:
        return new NotFoundError(message, error);
      case 429: {
        const headers = response?.headers as Record<string, unknown> | undefined;
        return new RateLimitError(message, headers?.['retry-after'] as number, error);
      }
      case 500:
      case 502:
      case 503:
      case 504:
        return new ServerError(message, error);
      default:
        return new ApiError(message, status, 'API_ERROR', status >= 500, error);
    }
  }

  return new ApiError('An unexpected error occurred', 500, 'UNKNOWN_ERROR', false, error);
}

/**
 * User-friendly error messages
 */
export function getErrorMessage(error: unknown): string {
  const apiError = parseApiError(error);
  
  // Don't expose internal errors to users
  if (apiError.status >= 500) {
    return 'Something went wrong. Please try again later.';
  }
  
  return apiError.message;
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  const apiError = parseApiError(error);
  return apiError.isRetryable;
}
