'use client';

import { memo } from 'react';
import { MOBILE_LENGTH, normalizePhoneInput } from '@/lib/validations';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFocusChange?: (isFocused: boolean) => void;
}

function PhoneInputComponent({ value, onChange, placeholder = 'Enter mobile number', onFocusChange }: PhoneInputProps) {
  const digits = normalizePhoneInput(value);
  const isComplete = digits.length === MOBILE_LENGTH;

  return (
    <div className="h-14 flex items-center border border-gray-300 rounded-xl px-4 bg-white">
      <span className="text-gray-700 font-medium mr-1">+91</span>
      <span className="text-gray-400 mr-2">|</span>
      <input
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder={placeholder}
        maxLength={10}
        value={digits}
        onChange={(e) => {
          const newDigits = normalizePhoneInput(e.target.value);
          onChange(newDigits);
        }}
        onFocus={() => onFocusChange?.(true)}
        onBlur={() => onFocusChange?.(false)}
        className={`flex-1 min-w-0 bg-transparent outline-none ${value ? 'text-gray-900' : 'text-gray-400'}`}
      />
      {isComplete && (
        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </div>
  );
}

export const PhoneInput = memo(PhoneInputComponent);
