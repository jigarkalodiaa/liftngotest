'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMenu } from './PageWrapper';
import { SITE_NAME } from '@/lib/site';

const HEADER_BAR_HEIGHT = 56;
const HEADER_TOP_GAP = 24;
const HEADER_TOTAL_HEIGHT = HEADER_TOP_GAP + HEADER_BAR_HEIGHT;

const DESKTOP_NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Promotions', href: '/promotions' },
  { label: 'FAQs', href: '/#faq' },
];

/** Sticky header that stays in place; content scrolls under it. Glass effect + shadow so it feels like it’s hovering. */
export default function Header() {
  const { openMenu, openLogin } = useMenu();

  return (
    <>
      {/* Spacer so initial content isn’t hidden; then everything scrolls under the fixed bar */}
      <div style={{ height: HEADER_TOTAL_HEIGHT }} aria-hidden />

      <header
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-4 md:pt-6 pointer-events-none"
        style={{ paddingBottom: 0 }}
      >
        <div
          className="pointer-events-auto max-w-7xl mx-auto h-14 md:h-[56px] rounded-xl md:rounded-[12px] flex items-center justify-between px-4 sm:px-6 border border-[#e8d5c4]"
          style={{
            background: 'rgba(252, 234, 216, 0.55)',
            backdropFilter: 'saturate(180%) blur(12px)',
            WebkitBackdropFilter: 'saturate(180%) blur(12px)',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.06)',
          }}
        >
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label={`${SITE_NAME} home`}>
            <Image
              src="/logo.png"
              alt={SITE_NAME}
              width={160}
              height={48}
              className="h-7 w-auto sm:h-8 md:h-9 object-contain"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Main">
            {DESKTOP_NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-black/5 rounded-lg transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={openLogin}
              className="rounded-xl bg-[var(--color-primary)] px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Login
            </button>
            <button
              onClick={openMenu}
              className="p-2 sm:p-2.5 rounded-xl text-gray-800 hover:bg-black/5 transition-colors"
              aria-label="Open menu"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
