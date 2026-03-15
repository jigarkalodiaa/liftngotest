'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import MobileMenu from './MobileMenu';
import { LoginModal } from '@/components/auth';
import { getAuthToken } from '@/lib/storage';
import { ROUTES } from '@/lib/constants';

interface MenuContextType {
  isMenuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a PageWrapper');
  }
  return context;
}

interface PageWrapperProps {
  children: ReactNode;
  /** Rendered outside the sliding panel so position:fixed works (e.g. Header). */
  headerSlot?: ReactNode;
}

export default function PageWrapper({ children, headerSlot }: PageWrapperProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);
  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  useEffect(() => {
    if (pathname === '/' && getAuthToken()) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [pathname, router]);

  useEffect(() => {
    if (isMenuOpen || isLoginOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen, isLoginOpen]);

  return (
    <MenuContext.Provider value={{ isMenuOpen, openMenu, closeMenu, isLoginOpen, openLogin, closeLogin }}>
      <div className="relative min-h-screen overflow-x-hidden bg-[var(--landing-bg)]">
        {/* Header outside transformed div so it stays fixed to the viewport */}
        {headerSlot}

        {/* Backdrop when menu open */}
        <div
          className={`fixed inset-0 bg-black/40 transition-opacity duration-300 z-30 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />

        {/* Main content that slides left when menu opens (no transform on header = fixed works) */}
        <div
          className={`relative z-40 transition-transform duration-300 ease-out ${
            isMenuOpen ? '-translate-x-[85vw]' : 'translate-x-0'
          }`}
        >
          <div
            className={`min-h-screen bg-[var(--landing-bg)] transition-all duration-300 ${
              isMenuOpen ? 'rounded-r-3xl overflow-hidden shadow-2xl' : ''
            }`}
          >
            {children}
          </div>

          {/* Overlay on content to close menu */}
          {isMenuOpen && (
            <div
              className="absolute inset-0 z-50"
              onClick={closeMenu}
            />
          )}
        </div>

        {/* Mobile Menu */}
        <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />

        {/* Login Modal */}
        <LoginModal isOpen={isLoginOpen} onClose={closeLogin} />
      </div>
    </MenuContext.Provider>
  );
}
