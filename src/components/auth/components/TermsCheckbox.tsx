'use client';

import { memo } from 'react';

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

function TermsCheckboxComponent({ checked, onChange, error }: TermsCheckboxProps) {
  return (
    <div className="mb-6">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-[var(--color-primary)]"
        />
        <span className="text-xs text-gray-600">
          By continuing, you agree to calls, including by{' '}
          <span className="font-semibold text-gray-800">IVR auto-dialer, WhatsApp, or Emails</span> from Liftngo and
          its affiliates.
        </span>
      </label>
      {error && (
        <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
            !
          </span>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export const TermsCheckbox = memo(TermsCheckboxComponent);
