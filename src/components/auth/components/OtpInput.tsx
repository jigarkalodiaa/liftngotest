'use client';

import { memo, useId, useState } from 'react';

interface OtpInputProps {
  otp: string[];
  onChange: (otp: string[]) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  length?: number;
  onFocusChange?: (isFocused: boolean) => void;
}

function OtpInputComponent({ otp, onChange, inputRef, length = 4, onFocusChange }: OtpInputProps) {
  const id = useId();
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, length).split('');
    const newOtp = Array.from({ length }, (_, i) => digits[i] ?? '');
    onChange(newOtp);
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocusChange?.(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onFocusChange?.(false);
  };

  // Find the active index (first empty box, or last box if all filled)
  const activeIndex = otp.findIndex((d) => d === '');
  const currentActiveIndex = activeIndex === -1 ? length - 1 : activeIndex;

  return (
    <label
      htmlFor={id}
      className="flex justify-center gap-2 mb-4 cursor-text select-none relative"
      role="group"
      aria-label="OTP digits – click to type"
    >
      <input
        id={id}
        ref={inputRef}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={length}
        value={otp.join('')}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="absolute inset-0 w-full h-full opacity-0 cursor-text"
        aria-label={`Enter ${length}-digit OTP`}
      />
      {otp.map((digit, i) => {
        const isActive = isFocused && i === currentActiveIndex;
        const isFilled = digit !== '';
        
        return (
          <div
            key={i}
            className={`w-12 h-14 rounded-lg border-2 flex items-center justify-center text-2xl font-bold tabular-nums transition-all duration-150 ${
              isFilled
                ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-white'
                : isActive
                  ? 'border-[var(--color-primary)] bg-white ring-2 ring-[var(--color-primary)]/20'
                  : 'border-gray-300 text-gray-400 bg-gray-50'
            }`}
          >
            {digit}
            {isActive && !isFilled && (
              <span className="animate-pulse text-[var(--color-primary)]">|</span>
            )}
          </div>
        );
      })}
    </label>
  );
}

export const OtpInput = memo(OtpInputComponent);
