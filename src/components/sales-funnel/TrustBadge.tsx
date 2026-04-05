import type { ReactNode } from 'react';

type Props = {
  icon: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function TrustBadge({ icon, children, className = '' }: Props) {
  return (
    <span
      className={`inline-flex min-h-9 max-w-full items-center gap-2 rounded-full border border-gray-200/90 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm sm:text-[13px] ${className}`}
    >
      <span className="shrink-0 text-[var(--color-primary)]" aria-hidden>
        {icon}
      </span>
      {children}
    </span>
  );
}
