import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';

type Props = {
  title: string;
  description: string;
  /** “Is this for me?” hook */
  fitLabel?: string;
  href?: string;
  linkLabel?: string;
  icon?: ReactNode;
};

export default function ServiceCard({ title, description, fitLabel, href, linkLabel = 'Learn more', icon }: Props) {
  const body = (
    <>
      {icon ? <div className="mb-3 text-[var(--color-primary)]">{icon}</div> : null}
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {fitLabel ? (
        <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[var(--funnel-action)]">{fitLabel}</p>
      ) : null}
      <p className="mt-2 text-sm leading-relaxed text-gray-600 sm:text-base">{description}</p>
      {href ? (
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)]">
          {linkLabel}
          <ChevronRight className="h-4 w-4" aria-hidden />
        </span>
      ) : null}
    </>
  );

  const cardClass =
    'group funnel-card-lift flex h-full flex-col rounded-2xl bg-white p-6 shadow-md shadow-gray-900/5 ring-1 ring-gray-900/5';

  if (href) {
    return (
      <Link href={href} className={`${cardClass} block outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2`}>
        {body}
      </Link>
    );
  }

  return <div className={cardClass}>{body}</div>;
}
