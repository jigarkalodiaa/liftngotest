import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME } from '@/lib/site';
import ContentLayout from '@/components/layout/ContentLayout';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = generatePageMetadata({
  title: `Our Services | ${SITE_NAME}`,
  description: `Book Walk, 2 Wheeler, or 3 Wheeler delivery with ${SITE_NAME}. Fast, affordable goods transport and last-mile delivery.`,
  path: '/services',
  keywords: ['LiftnGo services', 'walk delivery', '2 wheeler delivery', '3 wheeler delivery', 'goods transport'],
});

const SERVICES = [
  {
    slug: 'walk',
    name: 'Walk',
    description: 'Small parcels and documents delivered on foot. Ideal for short distances and quick handoffs in dense areas.',
    image: '/dashboard/service-walk.png',
    href: '/services/walk',
  },
  {
    slug: '2-wheeler',
    name: '2 Wheeler',
    description: 'Fast, nimble delivery by two-wheeler. Best for medium-sized packages and same-day delivery across the city.',
    image: '/dashboard/service-2wheeler.png',
    href: '/services/2-wheeler',
  },
  {
    slug: '3-wheeler',
    name: '3 Wheeler',
    description: 'Larger loads and bulk orders. Three-wheeler service for heavier goods and regular logistics needs.',
    image: '/dashboard/service-3wheeler.png',
    href: '/services/3-wheeler',
  },
];

export default function ServicesPage() {
  return (
    <ContentLayout>
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="mb-12 sm:mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Our services
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
              Choose the right option for your delivery: Walk for small items, 2 Wheeler for speed, or 3 Wheeler for larger loads.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <Link
                key={s.slug}
                href={s.href}
                className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-[var(--color-primary)]/30 hover:shadow-md transition-all flex flex-col"
              >
                <div className="relative w-full aspect-square max-w-[140px] mx-auto mb-4 rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={s.image}
                    alt={s.name}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform"
                    sizes="140px"
                  />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{s.name}</h2>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">{s.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-[var(--color-primary)] font-medium text-sm group-hover:gap-2 transition-all">
                  Learn more
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/pickup-location"
              className="inline-flex items-center justify-center rounded-xl bg-[var(--color-primary)] px-8 py-3.5 text-base font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Book a delivery
            </Link>
          </div>
        </div>
      </main>
    </ContentLayout>
  );
}
