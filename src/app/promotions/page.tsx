import Image from 'next/image';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME } from '@/lib/site';
import ContentLayout from '@/components/layout/ContentLayout';

export const metadata = generatePageMetadata({
  title: `Promotions & Offers | ${SITE_NAME}`,
  description: `Current promotions and offers on ${SITE_NAME} delivery and transport services. Save on your next booking.`,
  path: '/promotions',
  keywords: ['LiftnGo offers', 'delivery discounts', 'logistics promotions', 'first order offer'],
});

const PROMOS = [
  {
    title: '₹0 delivery fee on first order',
    description: 'New to LiftnGo? Get zero delivery fee on your first booking. Perfect for trying our fast, reliable service. Other fees may apply.',
    cta: 'Book now',
    href: '/pickup-location',
    highlight: true,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80',
    alt: 'First order offer',
  },
  {
    title: 'Driver referral bonus',
    description: 'Refer a driver to the platform and earn a bonus when they complete their first trips. Grow with us and help expand the network.',
    cta: 'Learn more',
    href: '/careers',
    highlight: false,
    image: 'https://images.unsplash.com/photo-1522071820081-009b0126c71f?w=800&q=80',
    alt: 'Referral program',
  },
  {
    title: 'Food delivery – order & get it delivered',
    description: 'Order from partner restaurants and use LiftnGo to get your food delivered. Simple, quick, and reliable.',
    cta: 'Find restaurants',
    href: '/find-restaurant',
    highlight: false,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    alt: 'Food delivery',
  },
];

export default function PromotionsPage() {
  return (
    <ContentLayout>
      <main className="flex-1">
        {/* Hero with image */}
        <section className="relative overflow-hidden bg-gray-900">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1600&q=80"
              alt="Offers and promotions"
              fill
              className="object-cover opacity-60"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Promotions & offers
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto">
              Save on delivery and transport with current {SITE_NAME} promotions. Terms apply to each offer.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="space-y-8">
            {PROMOS.map((promo) => (
              <article
                key={promo.title}
                className={`rounded-2xl overflow-hidden border shadow-sm ${
                  promo.highlight
                    ? 'bg-[var(--landing-orange)]/10 border-[var(--landing-orange)]/30 ring-1 ring-[var(--landing-orange)]/20'
                    : 'bg-white border-gray-100'
                }`}
              >
                <div className="sm:flex">
                  <div className="relative h-52 sm:h-64 sm:w-80 sm:flex-shrink-0">
                    <Image
                      src={promo.image}
                      alt={promo.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 320px"
                    />
                    {promo.highlight && (
                      <div className="absolute top-3 left-3 rounded-lg bg-[var(--landing-orange)] px-3 py-1 text-sm font-semibold text-white">
                        Popular
                      </div>
                    )}
                  </div>
                  <div className="p-6 sm:p-8 flex flex-col justify-center">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                      {promo.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {promo.description}
                    </p>
                    <Link
                      href={promo.href}
                      className="inline-flex items-center justify-center rounded-xl bg-[var(--color-primary)] px-6 py-3 text-base font-semibold text-white hover:opacity-90 transition-opacity w-fit"
                    >
                      {promo.cta}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-10 text-sm text-gray-500 text-center">
            Offers may vary by city and service. See in-app or website for latest terms.
          </p>
        </div>
      </main>
    </ContentLayout>
  );
}
