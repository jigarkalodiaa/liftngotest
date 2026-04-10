'use client';

import { memo } from 'react';
import { PhoneInput } from '../components/PhoneInput';
import { TermsCheckbox } from '../components/TermsCheckbox';
import { ErrorMessage } from '../components/ErrorMessage';

interface PhoneStepProps {
  phoneNumber: string;
  onPhoneChange: (value: string) => void;
  termsChecked: boolean;
  onTermsChange: (checked: boolean) => void;
  phoneError?: string;
  termsError?: string;
  sendError?: string;
  onSubmit: () => void;
  onFocusChange?: (isFocused: boolean) => void;
}

function PhoneStepComponent({
  phoneNumber,
  onPhoneChange,
  termsChecked,
  onTermsChange,
  phoneError,
  termsError,
  sendError,
  onSubmit,
  onFocusChange,
}: PhoneStepProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="mb-3">
        <PhoneInput value={phoneNumber} onChange={onPhoneChange} onFocusChange={onFocusChange} />
        {phoneError && <ErrorMessage message={phoneError} />}
        {sendError && <ErrorMessage message={sendError} />}
      </div>

      <TermsCheckbox checked={termsChecked} onChange={onTermsChange} error={termsError} />
    </form>
  );
}

export const PhoneStep = memo(PhoneStepComponent);
