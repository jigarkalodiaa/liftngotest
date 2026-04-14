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

  // Check focus state on mount and when input ref changes
  useEffect(() => {
    const checkFocus = () => {
      if (inputRef.current && document.activeElement === inputRef.current) {
        setIsFocused(true);
      }
    };
    
    // Check immediately
    checkFocus();
    
    // Also check after a small delay (for auto-focus scenarios)
    const timer = setTimeout(checkFocus, 100);
    return () => clearTimeout(timer);
  }, [inputRef]);

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
    // Small delay to prevent flicker on mobile
    setTimeout(() => {
      if (document.activeElement !== inputRef.current) {
        setIsFocused(false);
        onFocusChange?.(false);
      }
    }, 50);
  };

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      setIsFocused(true);
      onFocusChange?.(true);
    }
  };

  // Find the active index (first empty box, or last box if all filled)
  const activeIndex = otp.findIndex((d) => d === '');
  const currentActiveIndex = activeIndex === -1 ? length - 1 : activeIndex;

  return (
    <div
      onClick={handleContainerClick}
      onTouchStart={handleContainerClick}
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
        style={{ caretColor: 'transparent' }}
        aria-label={`Enter ${length}-digit OTP`}
      />
      {otp.map((digit, i) => {
        const isFilled = digit !== '';
        const isActiveBox = isFocused && i === currentActiveIndex;
        
        // Styles based on state
        let borderColor = '#d1d5db';
        let backgroundColor = '#f9fafb';
        let boxShadow = 'none';
        let transform = 'scale(1)';
        
        if (isFilled) {
          borderColor = '#2C2D5B';
          backgroundColor = '#ffffff';
          boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
        } else if (isActiveBox) {
          borderColor = '#2C2D5B';
          backgroundColor = '#ffffff';
          boxShadow = '0 0 0 4px rgba(44, 45, 91, 0.25), 0 4px 12px rgba(0,0,0,0.15)';
          transform = 'scale(1.08)';
        }
        
        return (
          <div
            key={i}
            style={{ borderColor, backgroundColor, boxShadow, transform }}
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
