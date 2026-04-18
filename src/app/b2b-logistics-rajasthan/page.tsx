import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Truck,
  Building2,
  Clock,
  Shield,
  MapPin,
  Phone,
  CheckCircle,
  ArrowRight,
  Package,
  Users,
  Zap,
  IndianRupee,
  MessageCircle,
} from 'lucide-react';
import ContentLayout from '@/components/layout/ContentLayout';
import JsonLd from '@/components/JsonLd';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_URL, SITE_NAME, LOGO_PATH } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import { SUPPORT_PHONE } from '@/config/env';

const PATH = '/b2b-logistics-rajasthan';
const PAGE_URL = `${SITE_URL}${PATH}`;

export const metadata: Metadata = generatePageMetadata({
  title: 'B2B Logistics Rajasthan — Business Delivery Solutions',
  description:
    'B2B logistics solutions across Rajasthan: reliable goods transport for hotels, restaurants, and suppliers. Same-day delivery from ₹50. GST billing available.',
  path: PATH,
  keywords: [
    'B2B logistics Rajasthan',
    'business delivery Rajasthan',
    'goods transport Rajasthan',
    'hotel logistics Rajasthan',
    'restaurant delivery Rajasthan',
    'supplier logistics Sikar',
    'commercial transport Rajasthan',
    'B2B delivery service',
    'Khatu logistics',
    'Sikar goods transport',
  ],
});

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${PAGE_URL}/#service`,
  name: 'Liftngo B2B Logistics Rajasthan',
  url: PAGE_URL,
  description:
    'B2B logistics solutions across Rajasthan for hotels, restaurants, suppliers, and businesses. Same-day delivery, GST billing, and verified drivers.',
  serviceType: 'B2B Logistics',
  areaServed: [
    { '@type': 'State', name: 'Rajasthan' },
    { '@type': 'City', name: 'Khatu' },
    { '@type': 'City', name: 'Sikar' },
    { '@type': 'City', name: 'Jaipur' },
  ],
  provider: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'INR',
    lowPrice: '50',
    highPrice: '500',
    offerCount: '100',
    availability: 'https://schema.org/InStock',
  },
  priceRange: '₹₹',
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'B2B Logistics Rajasthan', item: PAGE_URL },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What areas in Rajasthan does Liftngo cover for B2B logistics?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Liftngo provides B2B logistics services across Rajasthan, with strong coverage in Khatu Shyam Ji, Sikar district, and surrounding areas. We are expanding to Jaipur and other major cities.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the minimum order value for B2B delivery in Rajasthan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'There is no minimum order value. Our B2B delivery starts from just ₹50 for short-distance deliveries within Khatu and Sikar.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you provide GST billing for business deliveries?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Liftngo provides GST-compliant invoicing for all B2B deliveries. This is especially useful for hotels, restaurants, and registered businesses.',
      },
    },
    {
      '@type': 'Question',
      name: 'What types of vehicles are available for B2B logistics?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We offer 2-wheeler (bikes), 3-wheeler (auto/EV cargo), and 4-wheeler (mini trucks) options based on your cargo size and delivery requirements.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I schedule regular deliveries for my business?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we offer subscription plans for businesses with regular delivery needs. Contact us on WhatsApp to set up a custom delivery schedule.',
      },
    },
  ],
};

const BENEFITS = [
  {
    icon: Clock,
    title: 'Same-Day Delivery',
    description: 'Get your goods delivered within hours across Rajasthan. Express options available for urgent shipments.',
  },
  {
    icon: IndianRupee,
    title: 'Transparent Pricing',
    description: 'No hidden charges. Upfront pricing starting from ₹50 with GST-compliant invoicing for businesses.',
  },
  {
    icon: Shield,
    title: 'Verified Drivers',
    description: 'All our delivery partners are background-verified and trained for professional B2B handling.',
  },
  {
    icon: Package,
    title: 'Multi-Vehicle Fleet',
    description: 'Choose from 2W, 3W, or 4W vehicles based on your cargo size — from documents to bulk goods.',
  },
  {
    icon: Users,
    title: 'Dedicated Support',
    description: 'WhatsApp-first support for quick resolution. Track your deliveries in real-time.',
  },
  {
    icon: Zap,
    title: 'Subscription Plans',
    description: 'Regular delivery needs? Get discounted rates with our monthly subscription packages.',
  },
];

const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Request a Pickup',
    description: 'Book via WhatsApp or our app. Share pickup location, drop address, and cargo details.',
  },
  {
    step: 2,
    title: 'Driver Assignment',
    description: 'A verified driver is assigned within minutes. Track their arrival in real-time.',
  },
  {
    step: 3,
    title: 'Delivery & Confirmation',
    description: 'Goods delivered safely. Receive digital proof of delivery and GST invoice.',
  },
];

const FAQS = [
  {
    question: 'What areas in Rajasthan does Liftngo cover for B2B logistics?',
    answer: 'Liftngo provides B2B logistics services across Rajasthan, with strong coverage in Khatu Shyam Ji, Sikar district, and surrounding areas. We are expanding to Jaipur and other major cities.',
  },
  {
    question: 'What is the minimum order value for B2B delivery in Rajasthan?',
    answer: 'There is no minimum order value. Our B2B delivery starts from just ₹50 for short-distance deliveries within Khatu and Sikar.',
  },
  {
    question: 'Do you provide GST billing for business deliveries?',
    answer: 'Yes, Liftngo provides GST-compliant invoicing for all B2B deliveries. This is especially useful for hotels, restaurants, and registered businesses.',
  },
  {
    question: 'What types of vehicles are available for B2B logistics?',
    answer: 'We offer 2-wheeler (bikes), 3-wheeler (auto/EV cargo), and 4-wheeler (mini trucks) options based on your cargo size and delivery requirements.',
  },
  {
    question: 'Can I schedule regular deliveries for my business?',
    answer: 'Yes, we offer subscription plans for businesses with regular delivery needs. Contact us on WhatsApp to set up a custom delivery schedule.',
  },
];

export default function B2BLogisticsRajasthanPage() {
  const whatsappNumber = SUPPORT_PHONE || '918580584898';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi%20Liftngo%2C%20I%20need%20B2B%20logistics%20services%20in%20Rajasthan`;

  return (
    <ContentLayout breadcrumbs={[{ name: 'B2B Logistics Rajasthan', path: PATH }]}>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2C2D5B] to-[#1a1b3a] text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <Building2 className="h-4 w-4" />
              B2B Logistics Partner
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              B2B Logistics Solutions Across Rajasthan
            </h1>
            <p className="mt-6 text-lg text-white/80 sm:text-xl">
              Reliable goods transport for hotels, restaurants, and suppliers in Khatu, Sikar, and beyond. 
              Same-day delivery starting from <strong className="text-orange-400">₹50</strong> with GST billing.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center gap-3 rounded-full bg-green-500 px-8 text-lg font-bold text-white shadow-lg transition-all hover:bg-green-600"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp Us Now
              </Link>
              <Link
                href={ROUTES.FARE_CALCULATOR}
                className="inline-flex h-14 items-center gap-2 rounded-full border-2 border-white/30 px-8 text-lg font-semibold text-white transition-all hover:bg-white/10"
              >
                Calculate Fare
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 px-4 py-6 text-sm text-gray-600 sm:gap-10">
          <span className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            500+ Business Clients
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            GST Billing Available
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Same-Day Delivery
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Verified Drivers
          </span>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="prose prose-lg mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900">
              Why Businesses in Rajasthan Choose Liftngo for B2B Logistics
            </h2>
            <p>
              Running a business in Rajasthan means dealing with unique logistics challenges — from the busy temple 
              corridors of Khatu Shyam Ji to the commercial hubs of Sikar and Jaipur. Liftngo understands these 
              challenges and provides <strong>B2B logistics solutions</strong> tailored for local businesses.
            </p>
            <p>
              Whether you&apos;re a hotel needing daily supplies, a restaurant requiring fresh ingredients, or a 
              supplier distributing goods across the region, our fleet of 2-wheelers, 3-wheelers, and 4-wheelers 
              ensures your deliveries reach on time, every time.
            </p>
            <p>
              Our pricing is transparent — starting from just <strong>₹50 for local deliveries</strong> and going 
              up to ₹150 for longer distances. We provide GST-compliant invoicing, making it easy for registered 
              businesses to claim input tax credits.
            </p>

            <h3 className="text-xl font-bold text-gray-900">
              Industries We Serve in Rajasthan
            </h3>
            <ul>
              <li><strong>Hotels & Dharamshalas:</strong> Daily supply deliveries, linen transport, guest luggage handling</li>
              <li><strong>Restaurants & Dhabas:</strong> Fresh produce, kitchen supplies, packaged food delivery</li>
              <li><strong>Retail Shops:</strong> Inventory restocking, inter-store transfers, customer deliveries</li>
              <li><strong>Wholesalers & Distributors:</strong> Bulk goods movement, last-mile distribution</li>
              <li><strong>Temple Trusts:</strong> Prasad distribution, event logistics, vendor coordination</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Key Benefits of Liftngo B2B Logistics
            </h2>
            <p className="mt-4 text-gray-600">
              Everything your business needs for reliable goods transport in Rajasthan
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#2C2D5B]/10 text-[#2C2D5B]">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{benefit.title}</h3>
                <p className="mt-2 text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              How B2B Logistics Works with Liftngo
            </h2>
            <p className="mt-4 text-gray-600">
              Simple 3-step process to get your goods delivered
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#2C2D5B] text-2xl font-bold text-white">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <details
                key={index}
                className="group rounded-xl border border-gray-200 bg-white"
              >
                <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-gray-900">
                  {faq.question}
                  <ArrowRight className="h-5 w-5 rotate-90 transition-transform group-open:rotate-[270deg]" />
                </summary>
                <div className="border-t border-gray-100 px-5 py-4 text-gray-600">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-center text-xl font-bold text-gray-900">
            Explore More Liftngo Services
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={ROUTES.BOOK_DELIVERY}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:shadow-md"
            >
              <Truck className="h-4 w-4" />
              Book Delivery in Khatu
            </Link>
            <Link
              href={ROUTES.FARE_CALCULATOR}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:shadow-md"
            >
              <IndianRupee className="h-4 w-4" />
              Calculate Delivery Fare
            </Link>
            <Link
              href={ROUTES.FLEET_BRANDING}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:shadow-md"
            >
              <Building2 className="h-4 w-4" />
              Fleet Branding Services
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:shadow-md"
            >
              <Package className="h-4 w-4" />
              All Delivery Services
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#2C2D5B]">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to Streamline Your Business Logistics?
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Join 500+ businesses in Rajasthan who trust Liftngo for their daily deliveries. 
            Get started with a free consultation today.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center gap-3 rounded-full bg-green-500 px-8 text-lg font-bold text-white shadow-lg transition-all hover:bg-green-600"
            >
              <MessageCircle className="h-5 w-5" />
              Chat on WhatsApp
            </Link>
            {SUPPORT_PHONE && (
              <a
                href={`tel:+${whatsappNumber}`}
                className="inline-flex h-14 items-center gap-2 rounded-full border-2 border-white/30 px-8 text-lg font-semibold text-white transition-all hover:bg-white/10"
              >
                <Phone className="h-5 w-5" />
                Call Now
              </a>
            )}
          </div>
          <p className="mt-6 text-sm text-white/60">
            WhatsApp: +91 85805 84898 • Available 24/7
          </p>
        </div>
      </section>
    </ContentLayout>
  );
}
