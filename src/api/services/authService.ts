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
    return {
      ok: true,
      mocked: true,
      message: 'OTP request mocked for local flow without backend',
      mobile,
    };
  }
  return authApiClient.post<SendOtpResponse>('/auth/send-otp', { mobile });
}

export async function resendOtp(mobile: string): Promise<SendOtpResponse> {
  const base = getPublicAuthApiBase();
  if (!base) {
    return {
      ok: true,
      mocked: true,
      message: 'OTP resend mocked for local flow without backend',
      mobile,
    };
  }
  return authApiClient.post<SendOtpResponse>('/auth/resend-otp', { mobile });
}
