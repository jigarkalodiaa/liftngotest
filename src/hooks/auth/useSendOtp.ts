'use client';

import { useMutation } from '@tanstack/react-query';
import { sendOtp } from '@/api/services/authService';
import { toIndianE164 } from '@/lib/auth/mobileE164';
import { normalizePhoneInput } from '@/lib/validations';

export function useSendOtp() {
  return useMutation({
    mutationFn: async (rawPhone: string) => {
      const digits = normalizePhoneInput(rawPhone);
      const mobile = toIndianE164(digits);
      return sendOtp(mobile);
    },
  });
}
