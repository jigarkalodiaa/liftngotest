'use client';

import Image from '@/components/OptimizedImage';
import Link from 'next/link';
import { LOGO_PATH, SITE_NAME } from '@/lib/site';
import { ROUTES } from '@/lib/constants';

export default function PlansHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-6xl items-center px-4 py-2.5 md:px-6 lg:px-8">
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
      </div>
    </header>
  );
}
