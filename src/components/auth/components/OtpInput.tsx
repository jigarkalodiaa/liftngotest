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
      inputRefs.current[0]?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  
  // Calculate which box should be highlighted (first empty one) - ALWAYS highlight this
  const firstEmptyIndex = otp.findIndex(d => d === '');
  const highlightIndex = firstEmptyIndex === -1 ? length - 1 : firstEmptyIndex;

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
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
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        onChange(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
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
    
    const nextEmpty = newOtp.findIndex(d => d === '');
    const targetIndex = nextEmpty === -1 ? length - 1 : nextEmpty;
    inputRefs.current[targetIndex]?.focus();
  };

  const handleFocus = () => {
    onFocusChange?.(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      const stillInOtp = inputRefs.current.some(ref => ref === document.activeElement);
      if (!stillInOtp) {
        onFocusChange?.(false);
      }
    }, 10);
  };

  // Always highlight first box if all empty, otherwise highlight first empty box
  const shouldHighlight = (index: number): boolean => {
    // If this box has a digit, show filled style
    if (otp[index]) return false;
    // Highlight the first empty box
    return index === highlightIndex;
  };

  return (
    <div 
      className="flex justify-center gap-3 mb-4"
      role="group"
      aria-label="OTP input"
    >
      {otp.map((digit, i) => {
        const isFilled = digit !== '';
        const isHighlighted = shouldHighlight(i);
        
        // Border: primary color for filled OR highlighted, gray for others
        const borderStyle = (isFilled || isHighlighted) 
          ? '2px solid #2C2D5B' 
          : '2px solid #d1d5db';
        
        return (
          <div
            key={i}
            onClick={() => inputRefs.current[i]?.focus()}
            style={{
              width: 60,
              height: 68,
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'text',
              transition: 'all 150ms ease-out',
              border: borderStyle,
              backgroundColor: (isFilled || isHighlighted) ? '#ffffff' : '#f9fafb',
              boxShadow: isHighlighted 
                ? '0 0 0 3px rgba(44, 45, 91, 0.2)' 
                : 'none',
            }}
          >
            <input
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
              style={{
                width: '100%',
                height: '100%',
                background: 'transparent',
                textAlign: 'center',
                fontSize: 26,
                fontWeight: 700,
                outline: 'none',
                border: 'none',
                color: '#2C2D5B',
                caretColor: '#2C2D5B',
              }}
              aria-label={`Digit ${i + 1}`}
            />
          </div>
        );
      })}
    </div>
  );
}

export const OtpInput = memo(OtpInputComponent);
