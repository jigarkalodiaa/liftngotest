/**
 * Centralized error handling (TRD §12).
 * API errors return meaningful messages; technical details logged for debugging.
 */

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly statusCode?: number,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export interface ApiErrorPayload {
  message?: string;
  /** Some backends use `error` instead of `message`. */
  error?: string;
  code?: string;
  errors?: Record<string, string[]>;
}

/**
 * Normalize API error to a user-facing message.
 * Logs full error in development.
 */
export function normalizeApiError(error: unknown): string {
  if (error instanceof AppError) return error.message;

  if (error && typeof error === 'object' && 'response' in error) {
    const ax = error as { response?: { data?: ApiErrorPayload; status?: number } };
    const data = ax.response?.data as ApiErrorPayload | undefined;
    const msg = data?.message ?? (typeof data?.error === 'string' ? data.error : undefined) ?? data?.errors?.message?.[0];
    if (typeof msg === 'string') {
      if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
        console.warn('[API Error]', ax.response?.status, data);
      }
      return msg;
    }
  }

  if (error instanceof Error) {
    if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.warn('[Error]', error);
    }
    return error.message || 'Something went wrong';
  }

  return 'Something went wrong. Please try again.';
}

/**
 * Sanitize string for display (XSS prevention, TRD §14).
 */
export function sanitizeForDisplay(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
