import Image from '@/components/OptimizedImage';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME } from '@/lib/site';
import ContentLayout from '@/components/layout/ContentLayout';
import {
  indiaPhotoBangaloreLoadedTruck,
  indiaPhotoFoodTable,
  indiaPhotoFreightBoxes,
  indiaPhotoWarehouseLogistics,
} from '@/config/indiaLogisticsImages';

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
    image: indiaPhotoBangaloreLoadedTruck(800),
    alt: 'Indian city logistics — first booking offer',
  },
  {
    title: 'Driver referral bonus',
    description: 'Refer a driver to the platform and earn a bonus when they complete their first trips. Grow with us and help expand the network.',
    cta: 'Careers and driver referrals',
    href: '/careers',
    highlight: false,
    image: indiaPhotoFreightBoxes(800),
    alt: 'Parcels and cartons — driver partner referral for goods logistics',
  },
  {
    title: 'Food delivery – order & get it delivered',
    description: 'Order from partner restaurants and use LiftnGo to get your food delivered. Simple, quick, and reliable.',
    cta: 'Find restaurants',
    href: '/find-restaurant',
    highlight: false,
    image: indiaPhotoFoodTable(800),
    alt: 'Indian dining table — order food for delivery',
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
              src={indiaPhotoWarehouseLogistics(1600)}
              alt="Warehouse and B2B logistics — Liftngo promotions for goods transport"
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

          <section
            className="mt-14 rounded-2xl border border-gray-200 bg-white/80 p-6 sm:p-8 text-left"
            aria-labelledby="promotions-policies"
          >
            <h2 id="promotions-policies" className="text-xl font-semibold text-gray-900">
              How Liftngo promotions work
            </h2>
            <div className="mt-4 space-y-4 text-gray-600 leading-relaxed">
              <p>
                Campaigns on this page highlight seasonal demand—festival weekends around <strong className="text-gray-800">Khatu Shyam Ji</strong>,
                hotel stays when darshan queues peak, and B2B lanes in <strong className="text-gray-800">Noida</strong> when wholesale restocks spike.
                Each tile links to the flow it belongs to:{' '}
                <strong className="text-gray-800">book delivery</strong> for ad-hoc goods,{' '}
                <strong className="text-gray-800">restaurant menus</strong> when customers order food through verified partners, and{' '}
                <strong className="text-gray-800">EV cargo</strong> when payload and timing suit electric three- or four-wheel slots on our network.
              </p>
              <p>
                Discounts and limited-time codes apply only where the stated city and vehicle class are available; we do not advertise corridors
                we cannot serve competently. EV incentives may require minimum distance or quiet-time windows so charging and turnaround stay
                honest. Hotel bundles usually pair a stay with hyperlocal transport guidance rather than implying nationwide air connectivity—read the
                partner&apos;s cancellation and ID policies before you confirm.
              </p>
              <p>
                If an offer conflicts with in-app pricing, the booking screen at confirmation wins. Support can reconcile edge cases when you share
                a screenshot and booking reference. For recurring B2B lanes, ask our ops team whether a <strong className="text-gray-800">pilot contract</strong> fits better than
                promotional codes that reset every month.
              </p>
            </div>
          </section>

          <p className="mt-10 text-sm text-gray-500 text-center">
            Offers may vary by city and service. See in-app or website for latest terms.
          </p>
        </div>
      </main>
    </ContentLayout>
  );
}
