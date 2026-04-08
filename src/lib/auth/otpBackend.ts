import { getVerifyOtpUrl } from '@/path';

export type VerifyOtpUser = {
  userId: string;
  role: string;
  mobile: string;
  status: string;
};

export type VerifyOtpData = {
  user: VerifyOtpUser;
  accessToken: string;
  refreshToken?: string;
};

export type VerifyOtpBackendResult = {
  accessToken: string;
  refreshToken?: string;
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    mobile?: string;
    role?: string;
    status?: string;
  };
};

/**
 * Server-only: validate OTP with backend inside NextAuth `authorize`.
 * Expects the standard `{ success, data: { user, accessToken } }` envelope.
 */
export async function verifyOtpWithBackend(mobile: string, otp: string): Promise<VerifyOtpBackendResult | null> {
  const url = getVerifyOtpUrl().trim();
  if (!url) {
    console.error('[auth] Set NEXT_PUBLIC_API_BASE_URL or API_INTERNAL_BASE_URL for OTP verify.');
    return null;
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile, otp, role: 'DRIVER' }),
      cache: 'no-store',
    });
  } catch (e) {
    console.error('[auth] verify OTP fetch failed', e);
    return null;
  }

  if (!res.ok) return null;

  let body: ApiResponse<VerifyOtpData>;
  try {
    body = await res.json();
  } catch {
    return null;
  }

  if (!body?.success || !body?.data?.accessToken) return null;

  const { user, accessToken, refreshToken } = body.data;

  return {
    accessToken,
    refreshToken,
    user: user
      ? {
          id: user.userId,
          name: null,
          email: null,
          mobile: user.mobile,
          role: user.role,
          status: user.status,
        }
      : undefined,
  };
}
