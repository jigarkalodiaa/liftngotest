'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMenu } from './PageWrapper';

export default function Header() {
  const { openMenu, openLogin } = useMenu();

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between bg-[#D6BCA2]/80 backdrop-blur-md rounded-2xl px-6 py-3 shadow-lg border border-[#D6BCA2]/50">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="LiftnGo Logistics"
              width={140}
              height={50}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <div className="flex items-center gap-4">
            <button 
              onClick={openLogin}
              className="px-8 py-2.5 text-sm font-semibold text-white bg-[#1e3a5f] rounded-full hover:bg-[#152a45] transition-colors"
            >
              Login
            </button>
            <button 
              onClick={openMenu}
              className="p-2 text-[#1e3a5f]"
              aria-label="Open menu"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
