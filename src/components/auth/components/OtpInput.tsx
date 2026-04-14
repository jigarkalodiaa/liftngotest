'use client';

import { memo, useRef, useEffect } from 'react';

interface OtpInputProps {
  otp: string[];
  onChange: (otp: string[]) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  length?: number;
  onFocusChange?: (isFocused: boolean) => void;
}

function OtpInputComponent({ otp, onChange, inputRef, length = 4, onFocusChange }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Sync the first input ref with the passed inputRef for auto-focus
  useEffect(() => {
    if (inputRef && inputRefs.current[0]) {
      (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = inputRefs.current[0];
    }
  }, [inputRef]);

  // Auto-focus first input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const firstEmpty = otp.findIndex(d => d === '');
      const targetIndex = firstEmpty === -1 ? length - 1 : firstEmpty;
      inputRefs.current[targetIndex]?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1); // Take only last digit
    const newOtp = [...otp];
    newOtp[index] = digit;
    onChange(newOtp);

    // Auto-advance to next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current is empty, go back and clear previous
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        onChange(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current
        const newOtp = [...otp];
        newOtp[index] = '';
        onChange(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    const newOtp = Array.from({ length }, (_, i) => pastedData[i] ?? '');
    onChange(newOtp);
    
    // Focus appropriate input after paste
    const nextEmpty = newOtp.findIndex(d => d === '');
    const targetIndex = nextEmpty === -1 ? length - 1 : nextEmpty;
    inputRefs.current[targetIndex]?.focus();
  };

  const handleFocus = () => {
    onFocusChange?.(true);
  };

  const handleBlur = () => {
    // Check if focus moved to another OTP input
    setTimeout(() => {
      const stillInOtp = inputRefs.current.some(ref => ref === document.activeElement);
      if (!stillInOtp) {
        onFocusChange?.(false);
      }
    }, 10);
  };

  return (
    <div 
      className="flex justify-center gap-3 mb-4"
      role="group"
      aria-label="OTP input"
    >
      {otp.map((digit, i) => (
        <input
          key={i}
          ref={el => { inputRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="w-14 h-16 rounded-xl border-2 text-center text-2xl font-bold tabular-nums transition-all duration-150 outline-none focus:border-[#2C2D5B] focus:ring-4 focus:ring-[#2C2D5B]/20 focus:scale-105 focus:bg-white"
          style={{
            borderColor: digit ? '#2C2D5B' : '#d1d5db',
            backgroundColor: digit ? '#ffffff' : '#f9fafb',
            color: '#2C2D5B',
            caretColor: '#2C2D5B',
          }}
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  );
}

export const OtpInput = memo(OtpInputComponent);
