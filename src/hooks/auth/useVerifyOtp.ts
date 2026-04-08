'use client';

import { useMutation } from '@tanstack/react-query';
import { finalizeLoginSessionAfterOtp } from '@/lib/auth/finalizeLoginSession';
import { normalizePhoneInput } from '@/lib/validations';

export type VerifyOtpPayload = {
  phone: string;
  otp: string;
};

export type VerifyOtpResult = {
  nextPath: string;
};

/** Local-only OTP verify (no NextAuth / no backend call). */
export function useVerifyOtp() {
  return useMutation({
    mutationFn: async ({ phone, otp }: VerifyOtpPayload): Promise<VerifyOtpResult> => {
      const normalizedOtp = otp.replace(/\D/g, '');
      if (normalizedOtp.length !== 4) {
        throw new Error('Invalid or expired OTP. Please try again.');
      }
      const nextPath = finalizeLoginSessionAfterOtp(normalizePhoneInput(phone));

      return { nextPath };
    },
  });
}
