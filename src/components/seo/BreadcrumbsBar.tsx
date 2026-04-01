'use client';

import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import { buildBreadcrumbJsonLd } from '@/lib/structuredData/homepageGraph';
import type { BreadcrumbNavItem } from '@/lib/breadcrumbsNav';

type Props = {
  items: BreadcrumbNavItem[];
  /** Tighter vertical spacing when placed directly under a fixed header */
  className?: string;
  /** When false, only JSON-LD is emitted (page may render a hero-integrated trail). */
  showNav?: boolean;
};

/**
 * BreadcrumbList JSON-LD + optional visible row (same trail).
 */
export default function BreadcrumbsBar({ items, className = '', showNav = true }: Props) {
  if (!items.length) return null;

  const lastIndex = items.length - 1;

  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(items)} />
      {showNav ? (
        <nav
          className={`border-b border-gray-100 bg-white/90 px-4 py-3 backdrop-blur-sm sm:px-6 lg:px-8 ${className}`.trim()}
          aria-label="Breadcrumb"
        >
          <ol className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 text-sm text-gray-500">
            {items.map((it, i) => (
              <li key={`${it.path}-${i}`} className="flex flex-wrap items-center gap-2">
                {i > 0 ? <span aria-hidden className="text-gray-300">/</span> : null}
                {i < lastIndex ? (
                  <Link href={it.path} className="font-medium hover:text-[var(--color-primary)]">
                    {it.name}
                  </Link>
                ) : (
                  <span className="line-clamp-1 max-w-[min(100%,18rem)] font-medium text-gray-900 sm:max-w-xs">
                    {it.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      ) : null}
    </>
  );
}
