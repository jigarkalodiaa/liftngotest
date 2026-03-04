'use client';

import type { ButtonHTMLAttributes } from 'react';

const variants = {
  primary: 'bg-[var(--color-primary)] text-white hover:opacity-90 active:opacity-95',
  secondary: 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-50',
  danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  fullWidth?: boolean;
}

export default function Button({
  variant = 'primary',
  fullWidth,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`rounded-2xl py-3.5 text-[16px] font-semibold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] ${
        fullWidth ? 'w-full' : ''
      } ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
