'use client';

import { memo, useRef, useEffect, useState } from 'react';

interface OtpInputProps {
  otp: string[];
  onChange: (otp: string[]) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  length?: number;
  onFocusChange?: (isFocused: boolean) => void;
}

function OtpInputComponent({ otp, onChange, inputRef, length = 4, onFocusChange }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number>(0); // Start with first box highlighted
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Sync the first input ref with the passed inputRef for auto-focus
  useEffect(() => {
    if (inputRef && inputRefs.current[0]) {
      (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = inputRefs.current[0];
    }
  }, [inputRef]);

  // Auto-focus first input on mount with multiple attempts for mobile
  useEffect(() => {
    const focusFirst = () => {
      const firstEmpty = otp.findIndex(d => d === '');
      const targetIndex = firstEmpty === -1 ? length - 1 : firstEmpty;
      setFocusedIndex(targetIndex);
      inputRefs.current[targetIndex]?.focus();
    };
    
    // Try multiple times for mobile browsers
    focusFirst();
    const t1 = setTimeout(focusFirst, 100);
    const t2 = setTimeout(focusFirst, 300);
    const t3 = setTimeout(focusFirst, 500);
    
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const handleChange = (index: number, value: string) => {
    setHasInteracted(true);
    const digit = value.replace(/\D/g, '').slice(-1); // Take only last digit
    const newOtp = [...otp];
    newOtp[index] = digit;
    onChange(newOtp);

    // Auto-advance to next input
    if (digit && index < length - 1) {
      setFocusedIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    setHasInteracted(true);
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current is empty, go back and clear previous
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        onChange(newOtp);
        setFocusedIndex(index - 1);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current
        const newOtp = [...otp];
        newOtp[index] = '';
        onChange(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      setFocusedIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      setFocusedIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setHasInteracted(true);
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    const newOtp = Array.from({ length }, (_, i) => pastedData[i] ?? '');
    onChange(newOtp);
    
    // Focus appropriate input after paste
    const nextEmpty = newOtp.findIndex(d => d === '');
    const targetIndex = nextEmpty === -1 ? length - 1 : nextEmpty;
    setFocusedIndex(targetIndex);
    inputRefs.current[targetIndex]?.focus();
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
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
      {otp.map((digit, i) => {
        const isFilled = digit !== '';
        const isHighlighted = i === focusedIndex;
        
        // Determine styles based on state
        const borderColor = isFilled || isHighlighted ? '#2C2D5B' : '#d1d5db';
        const bgColor = isFilled || isHighlighted ? '#ffffff' : '#f9fafb';
        const shadow = isHighlighted 
          ? '0 0 0 3px rgba(44, 45, 91, 0.3), 0 4px 12px rgba(0,0,0,0.15)' 
          : isFilled 
            ? '0 1px 3px rgba(0,0,0,0.1)' 
            : 'none';
        const scale = isHighlighted ? 'scale(1.08)' : 'scale(1)';
        
        return (
          <div
            key={i}
            onClick={() => {
              inputRefs.current[i]?.focus();
              setFocusedIndex(i);
            }}
            className={`
              w-14 h-16 rounded-xl flex items-center justify-center cursor-text
              transition-all duration-150
              ${isHighlighted ? 'border-[3px]' : 'border-2'}
            `}
            style={{
              borderColor,
              backgroundColor: bgColor,
              boxShadow: shadow,
              transform: scale,
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
              onFocus={() => handleFocus(i)}
              onBlur={handleBlur}
              className="w-full h-full bg-transparent text-center text-2xl font-bold tabular-nums outline-none"
              style={{
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
