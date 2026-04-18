'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { LOGO_PATH, SITE_NAME } from '@/lib/site';
import { PRIMARY } from './constants';

interface HeaderProps {
  whatsappStartCampaignHref: string;
  scrollToCalculator: () => void;
}

export function Header({ whatsappStartCampaignHref, scrollToCalculator }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/98 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        {/* Logo + Feature Label */}
        <Link href={ROUTES.HOME} className="inline-flex items-center gap-2 sm:gap-3">
          <Image
            src={LOGO_PATH}
            alt={SITE_NAME}
            width={120}
            height={36}
            className="h-7 w-auto object-contain sm:h-8"
            priority
          />
          <span className="hidden rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider sm:inline sm:px-3 sm:text-[11px]" style={{ borderColor: `${PRIMARY}20`, color: PRIMARY }}>
            Fleet Branding
          </span>
        </Link>
        
        {/* Navigation */}
        <nav className="hidden items-center gap-5 text-xs font-medium text-gray-500 md:flex lg:gap-6 lg:text-[13px]">
          <button type="button" onClick={() => document.getElementById('why-branding')?.scrollIntoView({ behavior: 'smooth' })} className="transition hover:text-gray-900">
            Why Fleet Branding
          </button>
          <button type="button" onClick={scrollToCalculator} className="transition hover:text-gray-900">
            Pricing
          </button>
          <button type="button" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} className="transition hover:text-gray-900">
            How It Works
          </button>
        </nav>
        
        {/* CTA */}
        <Link
          href={whatsappStartCampaignHref}
          target="_blank"
          rel="noopener noreferrer"
          className="premium-btn inline-flex h-9 items-center gap-1.5 rounded-lg px-4 text-xs font-bold text-white sm:h-10 sm:gap-2 sm:rounded-full sm:px-5 sm:text-[13px]"
          style={{ backgroundColor: PRIMARY }}
        >
          <span className="hidden sm:inline">Start Campaign</span>
          <span className="sm:hidden">Start</span>
          <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
        </Link>
      </div>
    </header>
  );
}
