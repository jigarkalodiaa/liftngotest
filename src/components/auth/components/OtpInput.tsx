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

  // Find the active index (first empty box, or last box if all filled)
  const activeIndex = otp.findIndex((d) => d === '');
  const currentActiveIndex = activeIndex === -1 ? length - 1 : activeIndex;

  // Determine which box should be highlighted
  const getBoxStyle = (i: number, digit: string) => {
    const isFilled = digit !== '';
    const isActiveBox = isFocused && i === currentActiveIndex;
    
    if (isFilled) {
      return {
        borderColor: '#2C2D5B',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        transform: 'scale(1)',
      };
    }
    
    if (isActiveBox) {
      return {
        borderColor: '#2C2D5B',
        backgroundColor: '#ffffff',
        boxShadow: '0 0 0 4px rgba(44, 45, 91, 0.2), 0 4px 12px rgba(0,0,0,0.15)',
        transform: 'scale(1.05)',
      };
    }
    
    return {
      borderColor: '#d1d5db',
      backgroundColor: '#f9fafb',
      boxShadow: 'none',
      transform: 'scale(1)',
    };
  };

  return (
    <div
      onClick={() => {
        inputRef.current?.focus();
      }}
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
        onFocus={() => {
          setIsFocused(true);
          onFocusChange?.(true);
        }}
        onBlur={() => {
          setIsFocused(false);
          onFocusChange?.(false);
        }}
        className="absolute inset-0 w-full h-full opacity-0 cursor-text z-10"
        style={{ caretColor: 'transparent' }}
        aria-label={`Enter ${length}-digit OTP`}
      />
      {otp.map((digit, i) => {
        const isFilled = digit !== '';
        const isActiveBox = isFocused && i === currentActiveIndex;
        const styles = getBoxStyle(i, digit);
        
        return (
          <div
            key={i}
            style={styles}
            className="w-14 h-16 rounded-xl border-2 flex items-center justify-center text-2xl font-bold tabular-nums transition-all duration-150"
          >
            {isFilled ? (
              <span style={{ color: '#2C2D5B' }}>{digit}</span>
            ) : isActiveBox ? (
              <span 
                className="w-0.5 h-7 rounded-full animate-pulse"
                style={{ backgroundColor: '#2C2D5B' }}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export const OtpInput = memo(OtpInputComponent);
