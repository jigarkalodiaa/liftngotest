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
      className="flex justify-center gap-3 mb-4 cursor-text select-none relative"
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
        className="absolute inset-0 w-full h-full opacity-0 cursor-text z-10"
        aria-label={`Enter ${length}-digit OTP`}
      />
      {otp.map((digit, i) => {
        const isActive = isFocused && i === currentActiveIndex;
        const isFilled = digit !== '';
        
        return (
          <div
            key={i}
            style={{
              borderColor: isFilled || (isFocused && isActive) ? 'var(--color-primary)' : '#e5e7eb',
              backgroundColor: isFocused && isActive ? '#ffffff' : isFilled ? '#ffffff' : '#f9fafb',
              boxShadow: isFocused && isActive ? '0 0 0 4px rgba(44, 45, 91, 0.15), 0 4px 12px rgba(0,0,0,0.1)' : isFilled ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
              transform: isFocused && isActive ? 'scale(1.08)' : 'scale(1)',
            }}
            className="w-14 h-16 rounded-xl border-2 flex items-center justify-center text-2xl font-bold tabular-nums transition-all duration-200"
          >
            <span style={{ color: isFilled ? 'var(--color-primary)' : '#9ca3af' }}>
              {digit}
            </span>
            {isActive && !isFilled && (
              <span 
                className="w-0.5 h-6 rounded-full animate-pulse"
                style={{ backgroundColor: 'var(--color-primary)' }}
              />
            )}
          </div>
        );
      })}
    </label>
  );
}

export const OtpInput = memo(OtpInputComponent);
