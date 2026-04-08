'use client';

import { useMutation } from '@tanstack/react-query';
import { resendOtp } from '@/service/authIntegrationService';
import { toIndianE164 } from '@/lib/auth/mobileE164';
import { normalizePhoneInput } from '@/lib/validations';

export function useResendOtp() {
  return useMutation({
    mutationFn: async (rawPhone: string) => {
      const digits = normalizePhoneInput(rawPhone);
      const mobile = toIndianE164(digits);
      return resendOtp(mobile);
    },
  });
}
