'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMenu } from './PageWrapper';

const HEADER_BAR_HEIGHT = 60;
const HEADER_TOP_GAP = 50;
const HEADER_TOTAL_HEIGHT = HEADER_TOP_GAP + HEADER_BAR_HEIGHT;

/** Sticky header that stays in place; content scrolls under it. Glass effect + shadow so it feels like it’s hovering. */
export default function Header() {
  const { openMenu, openLogin } = useMenu();

  return (
    <>
      {/* Spacer so initial content isn’t hidden; then everything scrolls under the fixed bar */}
      <div style={{ height: HEADER_TOTAL_HEIGHT }} aria-hidden />

      <header
        className="fixed top-0 left-0 right-0 z-50 px-6 pt-[50px] pointer-events-none"
        style={{ paddingBottom: 0 }}
      >
        <div
          className="pointer-events-auto max-w-7xl mx-auto h-[60px] rounded-[12px] flex items-center justify-between px-6 border border-[#e8d5c4]"
          style={{
            background: 'rgba(252, 234, 216, 0.55)',
            backdropFilter: 'saturate(180%) blur(24px)',
            WebkitBackdropFilter: 'saturate(180%) blur(24px)',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)',
          }}
        >
          <Link href="/" className="flex items-center gap-2" aria-label="LiftnGo Logistics home">
            <Image
              src="/logo.png"
              alt="LiftnGo Logistics"
              width={160}
              height={48}
              className="h-8 w-auto sm:h-9 object-contain"
            />
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={openLogin}
              className="rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Login
            </button>
            <button
              onClick={openMenu}
              className="p-2.5 rounded-xl text-gray-800 hover:bg-black/5 transition-colors"
              aria-label="Open menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
