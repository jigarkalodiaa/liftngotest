'use client';

import { useMutation } from '@tanstack/react-query';
import { getSession, signIn } from 'next-auth/react';
import { toIndianE164 } from '@/lib/auth/mobileE164';
import { finalizeLoginSessionAfterOtp } from '@/lib/auth/finalizeLoginSession';
import { normalizePhoneInput } from '@/lib/validations';

export type VerifyOtpPayload = {
  phone: string;
  otp: string;
};

export type VerifyOtpResult = {
  nextPath: string;
};

/**
 * Verify OTP via NextAuth signIn → backend `/auth/verify-otp`.
 * Follows the CardStack `useLogin` pattern: mutation wraps the full
 * signIn + session finalization flow.
 */
export function useVerifyOtp() {
  return useMutation({
    mutationFn: async ({ phone, otp }: VerifyOtpPayload): Promise<VerifyOtpResult> => {
      const digits = normalizePhoneInput(phone);
      const mobile = toIndianE164(digits);

      const signInRes = await signIn('credentials', {
        mobile,
        otp,
        redirect: false,
      });

      if (signInRes?.error) {
        throw new Error('Invalid or expired OTP. Please try again.');
      }

      const session = await getSession();
      const nextPath = finalizeLoginSessionAfterOtp(phone, {
        accessToken: session?.accessToken ?? undefined,
      });

      return { nextPath };
    },
  });
}
