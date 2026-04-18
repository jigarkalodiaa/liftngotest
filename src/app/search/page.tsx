import { Metadata } from 'next';
import Link from 'next/link';
import { Search, ArrowRight, Truck, Calculator, Building2, Phone, HelpCircle, FileText } from 'lucide-react';
import ContentLayout from '@/components/layout/ContentLayout';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_URL, SITE_NAME } from '@/lib/site';
import { ROUTES } from '@/lib/constants';

const PATH = '/search';

export const metadata: Metadata = generatePageMetadata({
  title: 'Search Liftngo — Find Logistics Services',
  description:
    'Search Liftngo for logistics services, delivery options, fare calculator, fleet branding, and B2B transport solutions in Khatu, Rajasthan, and Delhi NCR.',
  path: PATH,
  keywords: [
    'search Liftngo',
    'find delivery service',
    'logistics search',
    'Khatu delivery',
    'B2B logistics search',
  ],
});

const QUICK_LINKS = [
  {
    title: 'Book Delivery',
    description: 'Instant goods delivery booking in Khatu and Delhi NCR',
    href: ROUTES.BOOK_DELIVERY,
    icon: Truck,
  },
  {
    title: 'Fare Calculator',
    description: 'Calculate delivery cost for 2W, 3W, and 4W vehicles',
    href: ROUTES.FARE_CALCULATOR,
    icon: Calculator,
  },
  {
    title: 'Fleet Branding',
    description: 'Advertise your brand on Liftngo delivery vehicles',
    href: ROUTES.FLEET_BRANDING,
    icon: Building2,
  },
  {
    title: 'B2B Transport',
    description: 'Business logistics solutions for Rajasthan and NCR',
    href: ROUTES.B2B_TRANSPORT,
    icon: Truck,
  },
  {
    title: 'Services',
    description: 'All delivery services — walk, 2W, 3W, 4W options',
    href: '/services',
    icon: FileText,
  },
  {
    title: 'FAQs',
    description: 'Common questions about Liftngo delivery services',
    href: '/faq',
    icon: HelpCircle,
  },
  {
    title: 'Contact Us',
    description: 'Get in touch for support or business enquiries',
    href: ROUTES.CONTACT,
    icon: Phone,
  },
];

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';

  return (
    <ContentLayout
      breadcrumbs={[{ name: 'Search', path: PATH }]}
    >
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2C2D5B]/10">
            <Search className="h-8 w-8 text-[#2C2D5B]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Search Liftngo Services
          </h1>
          <p className="mt-3 text-gray-600">
            Find logistics services, delivery options, and business solutions
          </p>
        </div>

        {/* Search Form */}
        <form action="/search" method="GET" className="mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search for services, locations, or topics..."
              className="w-full rounded-xl border border-gray-200 bg-white py-4 pl-12 pr-4 text-gray-900 shadow-sm transition-all focus:border-[#2C2D5B] focus:outline-none focus:ring-2 focus:ring-[#2C2D5B]/20"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-[#2C2D5B] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#2C2D5B]/90"
            >
              Search
            </button>
          </div>
        </form>

        {/* Search Results or Quick Links */}
        {query ? (
          <div className="mb-12">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Results for &quot;{query}&quot;
            </h2>
            <p className="text-gray-600">
              Browse our quick links below or{' '}
              <Link href={ROUTES.CONTACT} className="text-[#2C2D5B] underline">
                contact us
              </Link>{' '}
              for assistance.
            </p>
          </div>
        ) : null}

        {/* Quick Links Grid */}
        <div>
          <h2 className="mb-6 text-lg font-semibold text-gray-900">
            Popular Services
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-[#2C2D5B]/20 hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2C2D5B]/10 text-[#2C2D5B] transition-colors group-hover:bg-[#2C2D5B] group-hover:text-white">
                  <link.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#2C2D5B]">
                    {link.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{link.description}</p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-gray-300 transition-colors group-hover:text-[#2C2D5B]" />
              </Link>
            ))}
          </div>
        </div>

        {/* SEO Content */}
        <section className="mt-16 border-t border-gray-100 pt-10">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            About Liftngo Logistics Services
          </h2>
          <div className="prose prose-gray max-w-none text-gray-600">
            <p>
              Liftngo is a leading logistics company serving Khatu Shyam Ji, Rajasthan, 
              and Delhi NCR with reliable goods delivery services. Whether you need 
              same-day delivery, B2B transport solutions, or fleet branding services, 
              our platform connects you with verified drivers and transparent pricing.
            </p>
            <p className="mt-4">
              Use the search above to find specific services, or browse our popular 
              links to explore delivery options starting from ₹50. Our services include 
              2-wheeler, 3-wheeler (auto/EV), and 4-wheeler delivery vehicles for all 
              your logistics needs.
            </p>
          </div>
        </section>
      </div>
    </ContentLayout>
  );
}
