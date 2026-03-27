'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { ROUTES } from '@/lib/constants';
import { SITE_NAME, LOGO_PATH } from '@/lib/site';
import { CloseIcon } from '@/components/ui';
import { isUserAuthenticated, setLoggedIn, clearAuthToken } from '@/lib/storage';

type MenuItem = { label: string; href: string; authOnly?: boolean };

const menuSections: { title: string; items: MenuItem[] }[] = [
  {
    title: 'Preference',
    items: [
      { label: 'Home', href: ROUTES.HOME },
      { label: 'My Details', href: ROUTES.MY_DETAILS, authOnly: true },
      { label: 'Trip history', href: ROUTES.HISTORY, authOnly: true },
    ],
  },
  {
    title: 'LiftnGo',
    items: [
      { label: 'Book delivery', href: ROUTES.BOOK_DELIVERY },
      { label: 'Khatu Shyam Ji logistics', href: ROUTES.KHATU_SHYAM_LOGISTICS },
      { label: 'Noida & NCR B2B', href: ROUTES.NOIDA_B2B_LOGISTICS },
      { label: 'Why Choose', href: '/about' },
      { label: 'How LiftnGo Works', href: '/#features' },
      { label: 'Offers', href: '/promotions' },
    ],
  },
  {
    title: 'Other',
    items: [
      { label: 'FAQs', href: '/faq' },
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

function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) setIsAuthenticated(isUserAuthenticated());
  }, [isOpen]);

  // Focus close button when menu opens for keyboard/screen reader users
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus({ preventScroll: true });
    }
  }, [isOpen]);

  const handleLogout = useCallback(() => {
    clearAuthToken();
    setLoggedIn(false);
    onClose();
    router.push(ROUTES.HOME);
  }, [onClose, router]);

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
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
          <Link
            href={ROUTES.HOME}
            className="flex min-w-0 shrink items-center py-1"
            onClick={onClose}
            aria-label={`${SITE_NAME} home`}
          >
            <Image
              src={LOGO_PATH}
              alt={SITE_NAME}
              width={180}
              height={52}
              className="h-8 w-auto max-w-[9.5rem] object-contain object-left"
            />
          </Link>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="grid min-h-11 min-w-11 shrink-0 place-items-center rounded-full p-0 text-gray-500 transition-colors hover:text-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
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
                  .filter((item) => !item.authOnly || isAuthenticated)
                  .map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => onClose()}
                      className="flex min-h-11 w-full items-center justify-between py-3 text-left text-base text-gray-600 transition-colors hover:text-gray-900 group"
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
                    </Link>
                  </li>
                ))}
                {section.title === 'Preference' && isAuthenticated && (
                  <li>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex min-h-11 w-full items-center justify-between py-3 text-left text-base text-gray-600 transition-colors hover:text-gray-900 group"
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

export default memo(MobileMenu);
