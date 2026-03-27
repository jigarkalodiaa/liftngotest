'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { isUserAuthenticated, setLoginContinuationMessage, setPostLoginRedirect } from '@/lib/storage';

const LOGIN_CONTINUATION = 'Please log in to continue your food delivery booking.';

type BookDeliveryBoyLinkProps = {
  menuHref: string;
  enabled: boolean;
  label?: string;
};

export function BookDeliveryBoyLink({ menuHref, enabled, label = 'Book Delivery Boy' }: BookDeliveryBoyLinkProps) {
  const router = useRouter();
  const activeClass =
    'inline-flex min-h-[3.25rem] flex-[1.4] items-center justify-center rounded-xl bg-[var(--color-primary)] px-4 text-center text-sm font-bold text-white shadow-sm transition-opacity hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 active:opacity-90 sm:text-base';

  if (!enabled) {
    return (
      <span
        className={`${activeClass} cursor-not-allowed bg-gray-200 text-gray-500 opacity-100 shadow-none hover:opacity-100`}
        aria-disabled="true"
      >
        {label}
      </span>
    );
  }

  return (
    <Link
      href={menuHref}
      className={activeClass}
      onClick={(e) => {
        if (!isUserAuthenticated()) {
          e.preventDefault();
          setPostLoginRedirect(menuHref);
          setLoginContinuationMessage(LOGIN_CONTINUATION);
          router.push(`${ROUTES.LOGIN}?from=food`);
        }
      }}
    >
      {label}
    </Link>
  );
}

type ContinueToMenuLinkProps = {
  href: string;
  onNavigate?: () => void;
};

export function ContinueToMenuAuthLink({ href, onNavigate }: ContinueToMenuLinkProps) {
  const router = useRouter();

  return (
    <Link
      href={href}
      className="flex min-h-12 w-full items-center justify-center rounded-xl bg-[var(--color-primary)] text-sm font-semibold text-white hover:opacity-95"
      onClick={(e) => {
        if (!isUserAuthenticated()) {
          e.preventDefault();
          setPostLoginRedirect(href);
          setLoginContinuationMessage(LOGIN_CONTINUATION);
          router.push(`${ROUTES.LOGIN}?from=food`);
          return;
        }
        onNavigate?.();
      }}
    >
      Continue to menu &amp; book
    </Link>
  );
}
