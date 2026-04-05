'use client';

import TrackedLink from '@/components/TrackedLink';

type Props = {
  bookHref?: string;
  bookLabel?: string;
  bookTrackSource?: string;
  contactHref?: string;
  contactLabel?: string;
  contactTrackSource?: string;
  /** Use lighter secondary button for dark hero / navy footer bands. */
  secondaryOnDark?: boolean;
};

/** Conversion row: primary Book + Contact (no third-party chat handoff). */
export default function LocationPageCtas({
  bookHref = '/book-delivery',
  bookLabel = 'Book delivery now',
  bookTrackSource = 'location_page_book',
  contactHref = '/contact',
  contactLabel = 'Contact us',
  contactTrackSource = 'location_page_contact',
  secondaryOnDark = false,
}: Props) {
  const secondaryClass =
    secondaryOnDark ?
      'inline-flex items-center justify-center rounded-xl border-2 border-white/50 bg-white/10 px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-white/15'
    : 'inline-flex items-center justify-center rounded-xl border-2 border-gray-300 bg-white px-6 py-3.5 text-sm font-bold text-gray-800 shadow-sm hover:bg-gray-50';

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <TrackedLink
        href={bookHref}
        trackAs="book_now_click"
        trackSource={bookTrackSource}
        className="inline-flex items-center justify-center rounded-xl bg-[var(--color-primary)] px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:opacity-90"
      >
        {bookLabel}
      </TrackedLink>
      <TrackedLink
        href={contactHref}
        trackAs="cta_click"
        trackSource={contactTrackSource}
        className={secondaryClass}
      >
        {contactLabel}
      </TrackedLink>
    </div>
  );
}
