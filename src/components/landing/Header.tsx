'use client';

import Link from 'next/link';
import Image from 'next/image';
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
      </div>
    </header>
  );
}
