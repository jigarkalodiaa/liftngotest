'use client';

import Link from 'next/link';
import { HOMEPAGE_FAQ_PREVIEW } from '@/data/faq';
import FaqAccordionList from './FaqAccordionList';

/** Homepage FAQ — preview + link to full /faq page. */
export default function FaqSection() {
  return (
    <section id="faq" className="page-section w-full bg-white" aria-labelledby="faq-heading">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 sm:px-6 lg:px-8 xl:px-10">
        <h2 id="faq-heading" className="mb-4 text-center text-2xl font-bold text-gray-900 sm:mb-6 sm:text-3xl">
          FAQ
        </h2>
        <FaqAccordionList items={HOMEPAGE_FAQ_PREVIEW} className="max-w-2xl" analyticsScope="homepage_faq" />
        <Link
          href="/faq"
          className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl border border-[var(--landing-primary)]/35 bg-[var(--landing-primary)]/8 px-6 py-3 text-sm font-semibold text-[var(--landing-primary)] transition-colors hover:bg-[var(--landing-primary)]/15 focus-visible:outline focus-visible:ring-2 focus-visible:ring-[var(--landing-primary)] focus-visible:ring-offset-2"
        >
          Read all FAQs
        </Link>
      </div>
    </section>
  );
}
