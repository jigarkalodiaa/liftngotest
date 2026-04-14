import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { SITE_NAME } from '@/lib/site';
import { Building2, MapPin, Zap, Users, Headphones, BookOpen, Truck, Leaf, ArrowRight } from 'lucide-react';

/**
 * Crawlable authority copy for the homepage (sitelinks / topical depth).
 * Single section; H1 remains on Hero. Keeps existing layout import order stable.
 */

const FEATURES = [
  {
    icon: MapPin,
    title: 'Hyperlocal Delivery in Khatu',
    description: 'Temple-town density needs patience at narrow gates, predictable vehicle choice, and transparent pricing when festival crowds spike.',
    link: ROUTES.KHATU_SHYAM_LOGISTICS,
    linkText: 'Khatu Shyam delivery',
  },
  {
    icon: Building2,
    title: 'B2B Logistics in Delhi NCR',
    description: 'Supplier-park shuttles, retail backhaul, and dock windows. Right-size 2W document sprints vs 4W mini trucks.',
    link: ROUTES.NOIDA_B2B_LOGISTICS,
    linkText: 'Noida B2B logistics',
  },
  {
    icon: Leaf,
    title: 'EV Cargo & Smart Mode Choice',
    description: 'Electric 3W cargo when charging fits; conventional fuel for gradients and peak loads. Book what the map supports.',
    link: '/services',
    linkText: 'All delivery services',
  },
];

const QUICK_LINKS = [
  { icon: Users, label: 'Become a Driver', href: ROUTES.BECOME_DRIVER },
  { icon: Headphones, label: 'Contact Support', href: ROUTES.CONTACT },
  { icon: BookOpen, label: 'Read FAQs', href: '/faq' },
];

export default function HomeDeepAuthoritySection() {
  return (
    <section
      className="page-section bg-gray-50"
      aria-labelledby="home-authority-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 id="home-authority-heading" className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Why Businesses Choose {SITE_NAME}
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Built for <strong className="text-gray-900">intra-city cargo</strong>, not passenger detours. 
            Pick the right vehicle, see estimates upfront, and complete with handoff discipline.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-5 mb-8">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-[var(--landing-orange)]/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[var(--landing-orange)]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{feature.description}</p>
                <Link 
                  href={feature.link} 
                  className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] hover:underline"
                >
                  {feature.linkText}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Quick Links Row */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {QUICK_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:border-[var(--color-primary)]/30 hover:bg-gray-50 transition-colors"
              >
                <Icon className="w-4 h-4 text-[var(--color-primary)]" />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            href={ROUTES.B2B_TRANSPORT}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-3.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            <Truck className="w-4 h-4" />
            Explore B2B Services
          </Link>
          <Link
            href={ROUTES.KHATU_SHYAM_LOGISTICS}
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[var(--color-primary)] px-6 py-3.5 text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            Khatu Shyam Delivery
          </Link>
        </div>
      </div>
    </section>
  );
}
