/**
 * Auth service — public OTP endpoints via authApiClient.
 * Response envelope is unwrapped by the interceptor, so return values are the inner data.
 */

import { authApiClient } from '@/api/authApiClient';
import { getPublicAuthApiBase } from '@/config/authPublic';

export type SendOtpResponse = Record<string, unknown>;

export async function sendOtp(mobile: string): Promise<SendOtpResponse> {
  const base = getPublicAuthApiBase();
  if (!base) {
    throw new Error(
      'Set NEXT_PUBLIC_API_BASE_URL in .env.local (e.g. http://127.0.0.1:3001/api/v1), then stop dev, run rm -rf .next, and npm run dev again.',
    );
  }
  return authApiClient.post<SendOtpResponse>('/auth/send-otp', { mobile });
}

export async function resendOtp(mobile: string): Promise<SendOtpResponse> {
  const base = getPublicAuthApiBase();
  if (!base) {
    throw new Error(
      'Set NEXT_PUBLIC_API_BASE_URL in .env.local (e.g. http://127.0.0.1:3001/api/v1), then stop dev, run rm -rf .next, and npm run dev again.',
    );
  }
  return authApiClient.post<SendOtpResponse>('/auth/resend-otp', { mobile });
}
