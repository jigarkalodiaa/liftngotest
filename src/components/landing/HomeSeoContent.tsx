import Link from 'next/link';
import { ROUTES } from '@/lib/constants';

const SEO_LINKS: { href: string; label: string }[] = [
  { href: ROUTES.KHATU_SHYAM_LOGISTICS, label: 'Khatu Shyam Ji logistics' },
  { href: ROUTES.NOIDA_B2B_LOGISTICS, label: 'Noida B2B logistics' },
  { href: '/logistics-khatu', label: 'Logistics in Khatu' },
  { href: ROUTES.B2B_TRANSPORT, label: 'B2B transport India' },
  { href: ROUTES.FARE_CALCULATOR, label: 'Fare calculator' },
  { href: ROUTES.FLEET_BRANDING, label: 'Fleet branding' },
  { href: ROUTES.BOOK_DELIVERY, label: 'Book delivery' },
  { href: '/services', label: 'Services (2W–4W)' },
  { href: '/same-day-delivery-khatu', label: 'Same day delivery Khatu' },
  { href: '/hyperlocal-delivery-service', label: 'Hyperlocal delivery' },
  { href: '/whatsapp-delivery-service', label: 'WhatsApp delivery' },
  { href: '/b2b-logistics-rajasthan', label: 'B2B logistics Rajasthan' },
  { href: '/hotel-logistics-partner', label: 'Hotel logistics partner' },
  { href: '/restaurant-delivery-partner', label: 'Restaurant delivery' },
  { href: ROUTES.CONTACT, label: 'Contact & support' },
];

const linkTileClass =
  'group flex min-h-[3.25rem] items-center justify-between gap-3 rounded-xl border border-[var(--landing-primary)]/18 bg-white px-4 py-3 text-left text-sm font-semibold text-gray-900 shadow-[0_2px_12px_-4px_rgba(44,45,91,0.12)] transition-all active:scale-[0.99] hover:border-[var(--landing-primary)]/35 hover:bg-[var(--landing-primary)]/[0.06] hover:shadow-[0_4px_20px_-6px_rgba(44,45,91,0.2)] focus-visible:outline focus-visible:ring-2 focus-visible:ring-[var(--landing-primary)] focus-visible:ring-offset-2 sm:min-h-14 sm:text-[0.9375rem]';

/** Visible SEO copy + internal links — matches landing brand theme; mobile-first tile grid. */
export default function HomeSeoContent() {
  return (
    <section
      className="page-section border-y border-[var(--landing-primary)]/10 bg-[var(--landing-bg)]"
      aria-labelledby="seo-intro-heading"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-2xl border border-[var(--landing-primary)]/20 bg-white/90 p-6 sm:p-8"
          style={{
            boxShadow: '0 4px 32px -8px rgba(44, 45, 91, 0.12)',
          }}
        >
          <p className="mb-2 text-center text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[var(--landing-primary)] sm:text-xs">
            Where we operate
          </p>
          <h2
            id="seo-intro-heading"
            className="text-pretty text-center text-xl font-bold tracking-tight text-gray-900 sm:text-2xl md:text-3xl"
          >
            Khatu Shyam Ji hyperlocal · Noida &amp; Delhi NCR B2B
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-relaxed text-gray-700 sm:mt-5 sm:text-lg">
            Liftngo delivers reliable{' '}
            <strong className="font-semibold text-gray-900">logistics in Khatu Shyam Ji</strong> for vendors, food outlets, and shops, and{' '}
            <strong className="font-semibold text-gray-900">B2B logistics in Noida</strong> &amp; the wider{' '}
            <strong className="font-semibold text-gray-900">Delhi NCR</strong> corridor. Book bike, auto, or mini truck with upfront
            pricing, verified drivers, and real-time tracking.
          </p>

          <nav
            className="mt-6 grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 sm:mt-8 lg:grid-cols-3 lg:gap-6"
            aria-label="Key service pages"
          >
            {SEO_LINKS.map((item) => (
              <Link key={item.href} href={item.href} className={linkTileClass}>
                <span className="min-w-0 flex-1 leading-snug">{item.label}</span>
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--landing-primary)]/10 text-[var(--landing-primary)] transition-colors group-hover:bg-[var(--landing-primary)] group-hover:text-white"
                  aria-hidden
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
