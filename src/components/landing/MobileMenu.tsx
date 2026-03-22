'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { ROUTES } from '@/lib/constants';
import { CloseIcon } from '@/components/ui';
import { getLoggedIn, setLoggedIn, clearAuthToken } from '@/lib/storage';

type MenuItem = { label: string; href: string; authOnly?: boolean };

/** Delay (ms) before navigating after menu close – should match drawer’s CSS transition (duration-300 = 300ms). */
const MENU_CLOSE_MS = 300;

const menuSections: { title: string; items: MenuItem[] }[] = [
  {
    title: 'Preference',
    items: [
      { label: 'Home', href: ROUTES.HOME },
      { label: 'My Details', href: ROUTES.DASHBOARD },
      { label: 'Trip history', href: ROUTES.HISTORY, authOnly: true },
    ],
  },
  {
    title: 'LiftnGo',
    items: [
      { label: 'Why Choose', href: '/about' },
      { label: 'How LiftnGo Works', href: '/#features' },
      { label: 'Offers', href: '/promotions' },
    ],
  },
  {
    title: 'Other',
    items: [
      { label: 'FAQs', href: '/#faq' },
      { label: 'Customer Support', href: '/about' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) setIsLoggedIn(getLoggedIn());
  }, [isOpen]);

  // Focus close button when menu opens for keyboard/screen reader users
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus({ preventScroll: true });
    }
  }, [isOpen]);

  const handleLogout = () => {
    clearAuthToken();
    setLoggedIn(false);
    onClose();
    router.push(ROUTES.HOME);
  };

  const handleNavClick = (href: string) => {
    onClose();
    setTimeout(() => router.push(href), MENU_CLOSE_MS);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[85vw] max-w-[280px] sm:w-80 sm:max-w-none bg-white z-[60] shadow-2xl transform transition-transform duration-300 ease-out motion-reduce:transition-none ${
        isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'
      }`}
      aria-hidden={!isOpen}
      aria-label="Navigation menu"
      aria-modal="true"
    >
      <div className="flex flex-col h-full">
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded-full"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Menu content */}
        <div className="flex-1 overflow-y-auto px-6 pb-8">
          {menuSections.map((section) => (
            <div key={section.title} className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.items
                  .filter((item) => !item.authOnly || isLoggedIn)
                  .map((item) => (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() => handleNavClick(item.href)}
                      className="flex w-full items-center justify-between py-3 text-left text-gray-600 hover:text-gray-900 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        <span>{item.label}</span>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </li>
                ))}
                {section.title === 'Preference' && isLoggedIn && (
                  <li>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center justify-between py-3 text-gray-600 hover:text-gray-900 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v3.75m0 10.5A2.25 2.25 0 0113.5 21h-6a2.25 2.25 0 01-2.25-2.25V15m0 3h3" />
                        </svg>
                        <span>Logout</span>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
