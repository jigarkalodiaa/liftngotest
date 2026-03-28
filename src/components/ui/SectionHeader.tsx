import type { ReactNode } from 'react';

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function SectionHeader({ eyebrow, title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 space-y-1">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--khatu-saffron)]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-balance text-lg font-semibold leading-snug text-[var(--khatu-stone)] sm:text-xl">
          {title}
        </h2>
        {description ? (
          <p className="max-w-prose text-sm leading-relaxed text-[var(--khatu-stone-muted)]">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
