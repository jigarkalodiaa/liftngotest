'use client';

import Image from '@/components/OptimizedImage';
import Link from 'next/link';
import { LOGO_PATH, SITE_NAME } from '@/lib/site';
import { ROUTES } from '@/lib/constants';

export default function PlansHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 md:px-6 lg:px-8">
        <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2">
          <Image
            src={LOGO_PATH}
            alt={SITE_NAME}
            width={140}
            height={40}
            className="h-7 w-auto object-contain sm:h-8"
            priority
          />
        </Link>
        <Link
          href={ROUTES.DASHBOARD}
          className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3m8 0h3a1 1 0 001-1V10" />
          </svg>
          Dashboard
        </Link>
      </div>
    </header>
  );
}
