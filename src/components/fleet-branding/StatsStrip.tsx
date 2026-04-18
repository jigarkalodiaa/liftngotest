'use client';

import { TRUSTED_CATEGORIES } from './constants';

export function StatsStrip() {
  return (
    <section className="border-y border-gray-100 bg-white">
      <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-center text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 sm:mb-5 sm:text-[11px]">
            Trusted by leading brands
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:gap-x-10">
            {TRUSTED_CATEGORIES.map((cat) => (
              <span key={cat} className="text-xs font-semibold text-gray-300 transition hover:text-gray-500 sm:text-sm">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
