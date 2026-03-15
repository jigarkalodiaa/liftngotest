import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME } from '@/lib/site';
import ContentLayout from '@/components/layout/ContentLayout';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: `Promotions & Offers | ${SITE_NAME}`,
  description: `Current promotions and offers on ${SITE_NAME} delivery and transport services. Save on your next booking.`,
  path: '/promotions',
  keywords: ['LiftnGo offers', 'delivery discounts', 'logistics promotions', 'first order offer'],
});

const PROMOS = [
  {
    title: '₹0 delivery fee on first order',
    description: 'New to LiftnGo? Get zero delivery fee on your first booking. Other fees may apply.',
    cta: 'Book now',
    href: '/pickup-location',
    highlight: true,
  },
  {
    title: 'Driver referral bonus',
    description: 'Refer a driver to the platform and earn a bonus when they complete their first trips.',
    cta: 'Learn more',
    href: '/careers',
    highlight: false,
  },
];

export default function PromotionsPage() {
  return (
    <ContentLayout>
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Promotions & offers
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
              Save on delivery and transport with current {SITE_NAME} promotions. Terms apply to each offer.
            </p>
          </div>

          <div className="space-y-6">
            {PROMOS.map((promo) => (
              <div
                key={promo.title}
                className={`rounded-2xl p-6 sm:p-8 shadow-sm border ${
                  promo.highlight
                    ? 'bg-[var(--landing-orange)]/10 border-[var(--landing-orange)]/30'
                    : 'bg-white border-gray-100'
                }`}
              >
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                  {promo.title}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">{promo.description}</p>
                <Link
                  href={promo.href}
                  className="inline-flex items-center justify-center rounded-xl bg-[var(--color-primary)] px-6 py-3 text-base font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  {promo.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-10 text-sm text-gray-500">
            Offers may vary by city and service. See in-app or website for latest terms.
          </p>
        </div>
      </main>
    </ContentLayout>
  );
}
