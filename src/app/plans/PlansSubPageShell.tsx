'use client';

import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { ROUTES } from '@/lib/constants';

/**
 * Unified shell for /plans/* detail pages — matches the main plans hub (navy gradient, max-w-6xl, padding scale).
 * Sits below {@link PlansHeader} from `plans/layout.tsx`.
 */
export default function PlansSubPageShell({
  title,
  subtitle,
  badge,
  children,
  contentClassName = '',
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  children: ReactNode;
  /** Applied to the inner content wrapper (e.g. `-mt-6` to overlap hero). */
  contentClassName?: string;
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen min-w-0 overflow-x-clip bg-gray-50">
      <div className="bg-gradient-to-br from-[#1e1f4b] via-[#2C2D5B] to-[#3d3f7a] px-4 pb-8 pt-3 text-white md:px-6 md:pb-10 md:pt-4 lg:px-8">
        <div className="mx-auto w-full min-w-0 max-w-6xl">
          <button
            type="button"
            onClick={() => router.push(ROUTES.PLANS)}
            className="mb-3 flex min-h-11 w-fit items-center gap-1.5 rounded-lg text-xs font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white md:mb-4 md:text-sm"
          >
            <ChevronLeft className="h-4 w-4 shrink-0" strokeWidth={2} aria-hidden />
            All plans
          </button>
          {badge ? (
            <div className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[10px] font-semibold tracking-wide text-white/95 backdrop-blur-sm md:text-[11px]">
              {badge}
            </div>
          ) : null}
          <h1 className="mt-2 text-balance text-xl font-extrabold leading-tight tracking-tight md:mt-3 md:text-2xl lg:text-3xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/75 md:text-base">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div
        className={`mx-auto w-full min-w-0 max-w-6xl px-4 pb-24 pt-0 md:px-6 lg:px-8 ${contentClassName}`}
      >
        {children}
      </div>
    </div>
  );
}
