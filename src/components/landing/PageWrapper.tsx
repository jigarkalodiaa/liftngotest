'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import MobileMenu from './MobileMenu';
import { LoginModal } from '@/components/auth';

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
}

export default function PageWrapper({ children }: PageWrapperProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);
  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

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
      <div className="relative min-h-screen overflow-x-hidden bg-black">
        {/* Black background behind the shifted content */}
        <div
          className={`fixed inset-0 bg-black/60 transition-opacity duration-300 z-30 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        />

        {/* Main content that slides left only */}
        <div
          className={`relative z-40 transition-transform duration-300 ease-out ${
            isMenuOpen ? '-translate-x-[85vw]' : 'translate-x-0'
          }`}
        >
          <div
            className={`min-h-screen bg-[#FFF7ED] transition-all duration-300 ${
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
