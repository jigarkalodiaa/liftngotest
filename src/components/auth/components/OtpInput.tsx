'use client';

import { memo, useId, useState, useEffect, useCallback } from 'react';

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

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocusChange?.(true);
  }, [onFocusChange]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    onFocusChange?.(false);
  }, [onFocusChange]);

  // Also handle click on the container to focus input
  const handleContainerClick = useCallback(() => {
    inputRef.current?.focus();
    setIsFocused(true);
    onFocusChange?.(true);
  }, [inputRef, onFocusChange]);

  // Sync focus state with actual input focus
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const checkFocus = () => {
      const hasFocus = document.activeElement === input;
      setIsFocused(hasFocus);
    };

    // Check on mount
    checkFocus();

    // Also listen for focus events on document
    document.addEventListener('focusin', checkFocus);
    document.addEventListener('focusout', checkFocus);

    return () => {
      document.removeEventListener('focusin', checkFocus);
      document.removeEventListener('focusout', checkFocus);
    };
  }, [inputRef]);

  // Find the active index (first empty box, or last box if all filled)
  const activeIndex = otp.findIndex((d) => d === '');
  const currentActiveIndex = activeIndex === -1 ? length - 1 : activeIndex;

  return (
    <div
      onClick={handleContainerClick}
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
        const showHighlight = isActive || (isFocused && i === 0 && otp.every(d => d === ''));
        
        return (
          <div
            key={i}
            style={{
              borderColor: isFilled ? 'var(--color-primary)' : showHighlight ? 'var(--color-primary)' : '#d1d5db',
              backgroundColor: showHighlight ? '#ffffff' : isFilled ? '#ffffff' : '#f9fafb',
              boxShadow: showHighlight 
                ? '0 0 0 4px rgba(44, 45, 91, 0.2), 0 4px 12px rgba(0,0,0,0.15)' 
                : isFilled 
                  ? '0 1px 3px rgba(0,0,0,0.08)' 
                  : 'none',
              transform: showHighlight ? 'scale(1.05)' : 'scale(1)',
            }}
            className="w-14 h-16 rounded-xl border-2 flex items-center justify-center text-2xl font-bold tabular-nums transition-all duration-150"
          >
            {isFilled ? (
              <span style={{ color: 'var(--color-primary)' }}>{digit}</span>
            ) : showHighlight ? (
              <span 
                className="w-0.5 h-7 rounded-full"
                style={{ 
                  backgroundColor: 'var(--color-primary)',
                  animation: 'blink 1s step-end infinite',
                }}
              />
            ) : null}
          </div>
        );
      })}
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export const OtpInput = memo(OtpInputComponent);
