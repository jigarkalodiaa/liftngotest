import { generatePageMetadata } from '@/lib/seo';
import { MISSION, VISION, BRAND, SITE_NAME } from '@/lib/site';
import ContentLayout from '@/components/layout/ContentLayout';
import Link from 'next/link';

export const metadata = generatePageMetadata({
  title: `About Us | ${SITE_NAME}`,
  description:
    'LiftnGo is a technology-driven logistics platform for fast, affordable last-mile delivery and goods transport. Learn our mission, vision, and how we support drivers and businesses.',
  path: '/about',
  keywords: ['last mile delivery', 'goods transport', 'logistics platform', 'LiftnGo about', 'about us'],
});

export default function AboutPage() {
  return (
    <ContentLayout>
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="mb-10 sm:mb-14">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              About {BRAND.name}
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl">
              We’re building the logistics backbone for local goods movement—connecting businesses and individuals with verified drivers for fast, transparent, and reliable delivery.
            </p>
          </div>

          <div className="prose prose-gray max-w-none space-y-12">
            <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Who we are</h2>
              <p className="text-gray-600 leading-relaxed">{BRAND.projectDescription}</p>
            </section>

            <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Our mission</h2>
              <p className="text-gray-600 leading-relaxed">{MISSION}</p>
            </section>

            <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Our vision</h2>
              <p className="text-gray-600 leading-relaxed">{VISION}</p>
            </section>

            <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Technology-driven logistics</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {BRAND.name} connects customers with verified drivers and fleet owners through a simple digital booking system. We focus on transparent pricing, real-time tracking, and a strong driver network to simplify goods transportation for businesses and individuals.
              </p>
              <Link
                href="/pickup-location"
                className="inline-flex items-center justify-center rounded-xl bg-[var(--color-primary)] px-6 py-3 text-base font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Book a delivery
              </Link>
            </section>
          </div>
        </div>
      </main>
    </ContentLayout>
  );
}
