import type { HTMLAttributes } from 'react';

const styles = {
  neutral: 'bg-stone-100 text-stone-800 ring-stone-200/80',
  success: 'bg-emerald-50 text-emerald-900 ring-emerald-200/80',
  warning: 'bg-amber-50 text-amber-950 ring-amber-200/80',
  danger: 'bg-rose-50 text-rose-900 ring-rose-200/80',
  verified: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] ring-[var(--color-primary)]/25',
  popular: 'bg-orange-50 text-[var(--khatu-saffron)] ring-orange-200/70',
  muted: 'bg-stone-50 text-stone-600 ring-stone-200/60',
} as const;

export type BadgeVariant = keyof typeof styles;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export default function Badge({ className = '', variant = 'neutral', ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset ${styles[variant]} ${className}`.trim()}
      {...props}
    />
  );
}
