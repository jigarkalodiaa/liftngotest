'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';

export default function TermsBackButton() {
  const router = useRouter();

  const goBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(ROUTES.DASHBOARD);
  };

  return (
    <button
      type="button"
      onClick={goBack}
      className="inline-flex min-h-10 items-center gap-2 rounded-2xl border border-white/30 bg-[#5a5d78]/85 px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_20px_-10px_rgba(0,0,0,0.6)] backdrop-blur-md transition-colors hover:bg-[#66698a] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
      aria-label="Go back to previous page"
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>
  );
}
