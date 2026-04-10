'use client';

import { memo } from 'react';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
  isLoading?: boolean;
  loadingText?: string;
  showArrow?: boolean;
}

function PrimaryButtonComponent({
  children,
  onClick,
  disabled = false,
  type = 'button',
  isLoading = false,
  loadingText,
  showArrow = true,
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className="w-full py-4 bg-[var(--color-primary)] text-white font-semibold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {isLoading ? loadingText || children : children}
      {showArrow && (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      )}
    </button>
  );
}

export const PrimaryButton = memo(PrimaryButtonComponent);
