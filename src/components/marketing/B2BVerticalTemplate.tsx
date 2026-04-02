'use client';

import Link from 'next/link';
import WhatsAppButton from '@/components/marketing/WhatsAppButton';
import { ROUTES } from '@/lib/constants';

export type B2BVerticalTemplateProps = {
  h1: string;
  intro: string;
  bullets: string[];
  /** GA4 `trackWhatsAppClick` source */
  trackSource: string;
  whatsappPrefill: string;
};

export default function B2BVerticalTemplate({
  h1,
  intro,
  bullets,
  trackSource,
  whatsappPrefill,
}: B2BVerticalTemplateProps) {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{h1}</h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-600">{intro}</p>

        <ul className="mt-8 space-y-3 text-gray-700">
          {bullets.map((b) => (
            <li key={b} className="flex gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <span className="text-[var(--color-primary)]" aria-hidden>
                ✓
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <WhatsAppButton trackSource={trackSource} prefillMessage={whatsappPrefill} className="min-h-12 justify-center px-8">
            Book on WhatsApp
          </WhatsAppButton>
          <Link
            href={ROUTES.CONTACT}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border-2 border-[var(--color-primary)] bg-white px-8 py-3 text-sm font-semibold text-[var(--color-primary)] hover:bg-gray-50"
          >
            Partner with Liftngo
          </Link>
          <Link
            href={ROUTES.B2B_TRANSPORT}
            className="inline-flex min-h-12 items-center justify-center text-sm font-semibold text-gray-600 underline-offset-2 hover:text-gray-900 hover:underline"
          >
            B2B transport overview →
          </Link>
        </div>
      </div>
    </main>
  );
}
