'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginPanel from '@/components/auth/LoginPanel';
import { ROUTES } from '@/lib/constants';
import { consumeLoginContinuationMessage, isUserAuthenticated, peekPostLoginRedirect } from '@/lib/storage';

export default function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from');
  const [banner, setBanner] = useState<string | null>(null);

  useEffect(() => {
    setBanner(consumeLoginContinuationMessage());
  }, []);

  useEffect(() => {
    if (!isUserAuthenticated()) return;
    const next = peekPostLoginRedirect() ?? ROUTES.DASHBOARD;
    router.replace(next);
  }, [router]);

  return (
    <main className="flex-1 px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-lg">
        {from === 'food' || from === 'pickup' ? (
          <p className="mb-4 rounded-xl border border-[var(--color-primary)]/25 bg-[var(--color-primary)]/5 px-4 py-3 text-center text-sm text-gray-800">
            {banner ?? 'Please login to continue your booking.'}
          </p>
        ) : banner ? (
          <p className="mb-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center text-sm text-gray-800">{banner}</p>
        ) : null}

        <LoginPanel
          variant="page"
          onCompleted={(nextPath) => {
            router.replace(nextPath);
          }}
        />

        <p className="mt-8 text-center text-sm text-gray-600">
          <Link href={ROUTES.HOME} className="font-medium text-[var(--color-primary)] hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
