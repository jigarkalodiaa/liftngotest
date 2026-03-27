import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME, BRAND } from '@/lib/site';
import ContentLayout from '@/components/layout/ContentLayout';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = generatePageMetadata({
  title: `3 Wheeler Delivery | ${SITE_NAME}`,
  description: `Book 3 wheeler cargo for larger loads and bulk orders with ${BRAND.name}. Step up to 4W mini truck when you need more deck; expanded fleet coming soon.`,
  path: '/services/3-wheeler',
  keywords: [
    '3 wheeler delivery',
    'three wheeler cargo',
    'bulk delivery',
    'heavy goods',
    'Liftngo 3 wheeler',
    'tempo goods transport',
  ],
});

export default function ThreeWheelerServicePage() {
  return (
    <ContentLayout>
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm font-medium mb-8"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All services
          </Link>

          <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 items-start">
            <div className="flex-shrink-0 w-full sm:w-48">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
                <Image
                  src="/dashboard/service-3wheeler.png"
                  alt="3 Wheeler delivery"
                  fill
                  className="object-contain p-4"
                  sizes="192px"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                3 Wheeler delivery
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Larger loads and bulk orders delivered by three-wheeler. Perfect for heavier goods, regular logistics, and commercial deliveries. Reliable, cost-effective transport for businesses and individuals.
              </p>
              <ul className="space-y-2 text-gray-600 mb-8">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--landing-orange)] mt-0.5">•</span>
                  Suited for heavier parcels, inventory, and commercial goods
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--landing-orange)] mt-0.5">•</span>
                  Scheduled or on-demand; flexible booking
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--landing-orange)] mt-0.5">•</span>
                  GST-compliant billing; per-trip or bulk plans
                </li>
              </ul>
              <Link
                href="/pickup-location"
                className="inline-flex items-center justify-center rounded-xl bg-[var(--color-primary)] px-6 py-3 text-base font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Book 3 wheeler delivery
              </Link>
            </div>
          </div>
        </div>
      </main>
    </ContentLayout>
  );
}
