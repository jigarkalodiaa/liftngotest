import Image from 'next/image';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import { MISSION, VISION, BRAND, SITE_NAME } from '@/lib/site';
import ContentLayout from '@/components/layout/ContentLayout';

export const metadata = generatePageMetadata({
  title: `Why Choose Us | About ${SITE_NAME}`,
  description:
    'LiftnGo is a technology-driven logistics platform for fast, affordable last-mile delivery. Learn why businesses and individuals choose us—reliability, transparent pricing, and verified drivers.',
  path: '/about',
  keywords: ['last mile delivery', 'goods transport', 'logistics platform', 'LiftnGo about', 'why choose us'],
});

const WHY_CHOOSE = [
  {
    title: 'Fast & reliable delivery',
    description: 'Book a vehicle in seconds and get your goods picked up and delivered on time. Our driver network is built for speed and dependability.',
    image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80',
    alt: 'Delivery van on the road',
  },
  {
    title: 'Transparent pricing',
    description: 'See the fare upfront—no hidden charges. We believe in clear, honest pricing so you can plan your logistics with confidence.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
    alt: 'Transparent business',
  },
  {
    title: 'Verified driver partners',
    description: 'Every driver on our platform is verified. We focus on safety and quality so your goods are in trusted hands.',
    image: 'https://images.unsplash.com/photo-1522071820081-009b0126c71f?w=800&q=80',
    alt: 'Team and trust',
  },
  {
    title: 'Technology-first',
    description: 'Real-time tracking, digital booking, and smart routing. We use technology to make logistics simple and efficient.',
    image: 'https://images.unsplash.com/photo-1551431009-a802eeec77b1?w=800&q=80',
    alt: 'Technology and teamwork',
  },
  {
    title: 'Support when you need it',
    description: 'Our support team is here to help with bookings, tracking, or any questions. We are committed to your satisfaction.',
    image: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=800&q=80',
    alt: 'Customer support',
  },
];

export default function AboutPage() {
  return (
    <ContentLayout>
      <main className="flex-1">
        {/* Hero with image */}
        <section className="relative overflow-hidden bg-gray-900">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1600&q=80"
              alt="LiftnGo logistics and delivery"
              fill
              className="object-cover opacity-60"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Why choose {BRAND.name}?
            </h1>
            <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              We are building the logistics backbone for local goods movement—connecting you with verified drivers for fast, transparent, and reliable delivery.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Why choose us – cards with images */}
          <div className="space-y-12 sm:space-y-16">
            {WHY_CHOOSE.map((item, i) => (
              <article
                key={item.title}
                className={`rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm ${
                  i % 2 === 1 ? 'sm:flex-row-reverse' : ''
                } sm:flex`}
              >
                <div className="relative h-56 sm:h-72 sm:w-2/5 sm:min-w-[280px] flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 400px"
                  />
                </div>
                <div className="p-6 sm:p-8 flex flex-col justify-center">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Mission & Vision */}
          <section className="mt-16 grid sm:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-[var(--landing-primary)]/10 border border-[var(--landing-primary)]/20 p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Our mission</h2>
              <p className="text-gray-700 leading-relaxed">{MISSION}</p>
            </div>
            <div className="rounded-2xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Our vision</h2>
              <p className="text-gray-700 leading-relaxed">{VISION}</p>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-12 text-center">
            <p className="text-gray-600 mb-6">
              Ready to move your goods? Book a delivery in seconds.
            </p>
            <Link
              href="/pickup-location"
              className="inline-flex items-center justify-center rounded-xl bg-[var(--color-primary)] px-8 py-4 text-base font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Book a delivery
            </Link>
          </section>
        </div>
      </main>
    </ContentLayout>
  );
}
