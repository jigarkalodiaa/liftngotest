'use client';

import { memo } from 'react';
import { maskIndianMobile } from '@/lib/auth/mobileE164';
import { loginOtpSchema } from '@/lib/validations';
import { OtpInput } from '../components/OtpInput';
import { ErrorMessage } from '../components/ErrorMessage';

interface OtpStepProps {
  phoneNumber: string;
  otp: string[];
  onOtpChange: (otp: string[]) => void;
  otpInputRef: React.RefObject<HTMLInputElement | null>;
  otpError?: string;
  sendError?: string;
  countdown: number;
  isResending: boolean;
  onResend: () => void;
  onEditPhone: () => void;
  onFocusChange?: (isFocused: boolean) => void;
}

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function OtpStepComponent({
  phoneNumber,
  otp,
  onOtpChange,
  otpInputRef,
  otpError,
  sendError,
  countdown,
  isResending,
  onResend,
  onEditPhone,
  onFocusChange,
}: OtpStepProps) {
  const otpString = otp.join('');
  const otpFilled = otp.every((d) => d !== '');
  const otpValid = loginOtpSchema.safeParse({ otp: otpString }).success;

  return (
    <>
      <div className="mb-3 flex items-center gap-2">
        <p className="text-sm text-gray-700">
          Sent to <span className="font-semibold text-gray-900 tabular-nums">{maskIndianMobile(phoneNumber)}</span>
        </p>
        <button
          type="button"
          onClick={onEditPhone}
          className="p-1.5 rounded-lg text-[var(--color-primary)] hover:bg-gray-100"
          aria-label="Edit phone number"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
      </div>

      <OtpInput otp={otp} onChange={onOtpChange} inputRef={otpInputRef} onFocusChange={onFocusChange} />

      {otpFilled && !otpValid && <ErrorMessage message="Please enter a valid 4-digit OTP" />}
      {otpError && <ErrorMessage message={otpError} />}
      {sendError && <ErrorMessage message={sendError} />}

      <p className="text-sm text-gray-600 mb-4">
        Didn&apos;t receive OTP?{' '}
        {countdown > 0 ? (
          <span className="font-semibold text-[var(--color-primary)]">Resend in {formatTimer(countdown)}</span>
        ) : (
          <button
            type="button"
            disabled={isResending}
            onClick={onResend}
            className="font-semibold text-[var(--color-primary)] disabled:opacity-50"
          >
            {isResending ? 'Sending…' : 'Resend OTP'}
          </button>
        )}
      </p>
    </>
  );
}

export const OtpStep = memo(OtpStepComponent);
