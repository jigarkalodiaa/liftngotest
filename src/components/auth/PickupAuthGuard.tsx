'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { isUserAuthenticated, setLoginContinuationMessage, setPostLoginRedirect } from '@/lib/storage';

type Props = { children: React.ReactNode };

/**
 * Blocks `/pickup-location` for guests: stores return URL and sends users to `/login`.
 */
export default function PickupAuthGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  const search = searchParams.toString();

  useEffect(() => {
    const ok = isUserAuthenticated();
    setAllowed(ok);
    if (!ok) {
      const returnTo = search ? `${pathname}?${search}` : pathname;
      setPostLoginRedirect(returnTo);
      setLoginContinuationMessage('Please login to continue your booking.');
      router.replace(`${ROUTES.LOGIN}?from=pickup`);
    }
  }, [pathname, router, search]);

  if (allowed === null) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-2 px-4 text-center text-gray-600">
        <p className="text-sm font-medium">Checking your session…</p>
      </div>
    );
  }

  if (!allowed) return null;

  return <>{children}</>;
}
