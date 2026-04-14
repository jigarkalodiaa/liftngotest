'use client';

import { memo, useId, useState, useEffect } from 'react';

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
  const [showAllHighlight, setShowAllHighlight] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, length).split('');
    const newOtp = Array.from({ length }, (_, i) => digits[i] ?? '');
    onChange(newOtp);
    // After typing, remove the "all highlight" effect
    setShowAllHighlight(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Show all boxes highlighted briefly when first focused
    setShowAllHighlight(true);
    onFocusChange?.(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setShowAllHighlight(false);
    onFocusChange?.(false);
  };

  // Remove "all highlight" after a short delay to guide user to active box
  useEffect(() => {
    if (showAllHighlight && isFocused) {
      const timer = setTimeout(() => setShowAllHighlight(false), 600);
      return () => clearTimeout(timer);
    }
  }, [showAllHighlight, isFocused]);

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
        className="absolute inset-0 w-full h-full opacity-0 cursor-text"
        aria-label={`Enter ${length}-digit OTP`}
      />
      {otp.map((digit, i) => {
        const isActive = isFocused && i === currentActiveIndex;
        const isFilled = digit !== '';
        const shouldHighlight = isFocused && (showAllHighlight || isActive);
        
        return (
          <div
            key={i}
            className={`w-14 h-16 rounded-xl border-2 flex items-center justify-center text-2xl font-bold tabular-nums transition-all duration-200 ${
              isFilled
                ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-white shadow-sm'
                : shouldHighlight
                  ? 'border-[var(--color-primary)] bg-white shadow-md ring-4 ring-[var(--color-primary)]/15 scale-105'
                  : 'border-gray-200 text-gray-400 bg-gray-50/80'
            }`}
          >
            {digit}
            {isActive && !isFilled && (
              <span className="w-0.5 h-6 bg-[var(--color-primary)] animate-[blink_1s_ease-in-out_infinite] rounded-full" />
            )}
          </div>
        );
      })}
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </label>
  );
}

export const OtpInput = memo(OtpInputComponent);
