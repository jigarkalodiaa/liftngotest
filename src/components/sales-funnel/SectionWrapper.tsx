import type { ReactNode } from 'react';

type Props = {
  id?: string;
  /** Short label above H2 — optional AIDA stage hint */
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

/**
 * 8px grid: section vertical rhythm py-12 sm:py-16 (48 / 64px).
 * Content max-width matches existing Noida B2B article column.
 */
export default function SectionWrapper({ id, eyebrow, title, description, children, className = '' }: Props) {
  const headingId = id ? `${id}-heading` : undefined;
  return (
    <section id={id} {...(headingId ? { 'aria-labelledby': headingId } : {})} className={`scroll-mt-20 ${className}`}>
      <div className="max-w-4xl">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">{eyebrow}</p>
        ) : null}
        <h2 id={headingId} className="mt-2 text-balance text-2xl font-bold tracking-tight text-gray-900 sm:text-[1.65rem]">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-gray-600 sm:text-[1.05rem]">{description}</p>
        ) : null}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
