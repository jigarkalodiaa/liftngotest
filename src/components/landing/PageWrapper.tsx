'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import MobileMenu from './MobileMenu';
import { LoginModal } from '@/components/auth';
import { getAuthToken, getLandingPickupLocation, setLandingPickupLocation } from '@/lib/storage';
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

/** Shared hero / header pickup field draft (home scroll header + Hero stay in sync). */
interface LandingPickupContextType {
  pickupDraft: string;
  setPickupDraft: (value: string) => void;
}

const LandingPickupContext = createContext<LandingPickupContextType | undefined>(undefined);

export function useLandingPickup() {
  const ctx = useContext(LandingPickupContext);
  if (!ctx) {
    throw new Error('useLandingPickup must be used within a PageWrapper');
  }
  return ctx;
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
  const [pickupDraft, setPickupDraftState] = useState('');

  const setPickupDraft = useCallback((value: string) => {
    setPickupDraftState(value);
    if (!value.trim()) {
      setLandingPickupLocation(null);
    }
  }, []);

  useEffect(() => {
    const existing = getLandingPickupLocation()?.trim();
    if (existing) setPickupDraftState(existing);
  }, []);

  useEffect(() => {
    const trimmed = pickupDraft.trim();
    if (!trimmed) return;
    const t = window.setTimeout(() => setLandingPickupLocation(trimmed), 400);
    return () => window.clearTimeout(t);
  }, [pickupDraft]);

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
    <LandingPickupContext.Provider value={{ pickupDraft, setPickupDraft }}>
      <MenuContext.Provider value={{ isMenuOpen, openMenu, closeMenu, isLoginOpen, openLogin, closeLogin }}>
        <div
          className={`relative min-h-[100dvh] min-h-screen overflow-x-clip bg-[var(--landing-bg)] ${isMenuOpen || isLoginOpen ? 'overflow-y-hidden' : ''}`}
        >
          {headerSlot}

          {/* Backdrop: same 300ms ease-out as menu for in-sync transition; tap/click to close */}
          <div
            role="button"
            tabIndex={-1}
            onClick={closeMenu}
            onKeyDown={(e) => e.key === 'Escape' && closeMenu()}
            className={`fixed inset-0 z-[55] cursor-pointer touch-manipulation bg-black/40 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
              isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
            aria-hidden="true"
          />

          {/* Main content – never moves; menu overlays on top */}
          <div className="relative min-h-[100dvh] min-h-screen bg-[var(--landing-bg)]">
            {children}
          </div>

          <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />

          {/* Login Modal */}
          <LoginModal isOpen={isLoginOpen} onClose={closeLogin} />
        </div>
      </MenuContext.Provider>
    </LandingPickupContext.Provider>
  );
}
