import { generatePageMetadata } from '@/lib/seo';
import { MISSION, VISION, BRAND } from '@/lib/site';

export const metadata = generatePageMetadata({
  title: 'About Liftngo',
  description:
    'Liftngo is a technology-driven logistics platform for fast, affordable last-mile delivery and goods transport. Learn our mission, vision, and how we support drivers and businesses.',
  path: '/about',
  keywords: [
    'last mile delivery',
    'goods transport',
    'logistics platform',
    'Liftngo about',
  ],
});

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
          About {BRAND.name}
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          {BRAND.projectDescription}
        </p>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">{MISSION}</p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">{VISION}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Technology-driven logistics
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {BRAND.name} connects customers with verified drivers and fleet owners
            through a simple digital booking system, enabling seamless movement of
            goods within cities and local regions. We focus on transparent pricing,
            real-time tracking, and a strong driver network to simplify goods
            transportation for businesses and individuals.
          </p>
        </section>
      </div>
    </main>
  );
}
