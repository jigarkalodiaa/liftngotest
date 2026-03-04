'use client';

import Link from 'next/link';
import { useMenu } from './PageWrapper';

/** Sticky header with glass effect – LiftnGo LOGISTICS, Login, hamburger. */
export default function Header() {
  const { openMenu, openLogin } = useMenu();

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-[var(--landing-bg)]"
      style={{
        background: 'rgba(252, 251, 248, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 pt-5 pb-3 sm:pt-6 sm:pb-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="LiftnGo Logistics home">
            {/* Truck icon + LiftnGo + LOGISTICS to match design */}
            <svg
              className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 text-[var(--color-primary)]"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
            </svg>
            <div>
              <span className="block text-lg sm:text-xl font-bold leading-tight text-[var(--color-primary)]">
                LiftnGo
              </span>
              <span className="block text-[10px] sm:text-xs font-medium uppercase tracking-wider text-gray-700">
                Logistics
              </span>
            </div>
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
      </div>
    </header>
  );
}
