import { Metadata } from 'next';
import Link from 'next/link';
import {
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
  Bed,
  UtensilsCrossed,
  Shirt,
} from 'lucide-react';
import ContentLayout from '@/components/layout/ContentLayout';
import JsonLd from '@/components/JsonLd';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_URL, SITE_NAME } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import { SUPPORT_PHONE } from '@/config/env';

const PATH = '/hotel-logistics-partner';
const PAGE_URL = `${SITE_URL}${PATH}`;

export const metadata: Metadata = generatePageMetadata({
  title: 'Hotel Logistics Partner India — Liftngo',
  description:
    'Dedicated logistics partner for hotels and dharamshalas. Daily supply delivery, linen transport, guest services. Serving Khatu, Rajasthan & Delhi NCR.',
  path: PATH,
  keywords: [
    'hotel logistics partner India',
    'hotel delivery service',
    'dharamshala logistics',
    'hotel supply delivery',
    'linen transport service',
    'hotel vendor management',
    'hospitality logistics',
    'Khatu hotel delivery',
    'guest luggage delivery',
    'hotel inventory logistics',
  ],
});

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${PAGE_URL}/#service`,
  name: 'Hotel Logistics Partner — Liftngo',
  url: PAGE_URL,
  description:
    'Dedicated logistics solutions for hotels, dharamshalas, and hospitality businesses. Daily supply delivery, linen transport, and guest services.',
  serviceType: 'Hospitality Logistics',
  areaServed: [
    { '@type': 'Place', name: 'Khatu Shyam Ji, Rajasthan' },
    { '@type': 'AdministrativeArea', name: 'Delhi NCR' },
    { '@type': 'State', name: 'Rajasthan' },
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
    highPrice: '300',
    availability: 'https://schema.org/InStock',
  },
  audience: {
    '@type': 'Audience',
    audienceType: 'Hotels, Dharamshalas, Hospitality Businesses',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Hotel Logistics Partner', item: PAGE_URL },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What logistics services does Liftngo offer for hotels?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Liftngo provides daily supply delivery, linen and laundry transport, guest luggage handling, vendor pickups, emergency supplies, and scheduled inventory restocking for hotels and dharamshalas.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does hotel logistics service cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our hotel logistics services start from ₹50 per delivery. We also offer monthly subscription plans for hotels with regular delivery needs, providing significant cost savings.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you provide 24/7 delivery for hotels?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we understand hotels operate round the clock. Our delivery services are available 24/7, including early morning supplies and late-night emergencies.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can you handle bulk deliveries for large hotels?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. We have 3-wheeler and 4-wheeler vehicles for bulk deliveries. For very large orders, we can coordinate multiple vehicles simultaneously.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you serve hotels in Khatu Shyam Ji area?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Khatu Shyam Ji is our primary service area. We serve all hotels, dharamshalas, and guest houses around the temple and surrounding localities.',
      },
    },
  ],
};

const SERVICES = [
  {
    icon: Package,
    title: 'Daily Supply Delivery',
    description: 'Scheduled delivery of groceries, toiletries, and consumables from your preferred vendors.',
  },
  {
    icon: Shirt,
    title: 'Linen & Laundry Transport',
    description: 'Pick up dirty linen, deliver to laundry, and return fresh supplies — all on schedule.',
  },
  {
    icon: Bed,
    title: 'Guest Luggage Handling',
    description: 'Airport/station pickups, luggage delivery to rooms, and checkout transfers.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Kitchen & F&B Supplies',
    description: 'Fresh vegetables, dairy, beverages, and kitchen equipment delivery.',
  },
  {
    icon: Zap,
    title: 'Emergency Supplies',
    description: '24/7 urgent delivery for unexpected shortages — medicines, equipment, or guest requests.',
  },
  {
    icon: Users,
    title: 'Vendor Coordination',
    description: 'We pick up from multiple vendors and consolidate deliveries to save your time.',
  },
];

const BENEFITS = [
  {
    icon: Clock,
    title: 'Save Staff Time',
    description: 'Your staff focuses on guests while we handle all logistics runs.',
  },
  {
    icon: IndianRupee,
    title: 'Reduce Costs',
    description: 'No need to maintain delivery vehicles or hire dedicated drivers.',
  },
  {
    icon: Shield,
    title: 'Reliable & Tracked',
    description: 'Real-time tracking and delivery confirmations for every order.',
  },
  {
    icon: CheckCircle,
    title: 'GST Billing',
    description: 'Proper invoicing for all deliveries — easy accounting and tax compliance.',
  },
];

const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Share Your Requirements',
    description: 'Tell us your daily delivery needs, preferred timings, and vendor locations.',
  },
  {
    step: 2,
    title: 'Custom Schedule Setup',
    description: 'We create a delivery schedule tailored to your hotel operations.',
  },
  {
    step: 3,
    title: 'Daily Execution',
    description: 'Our drivers handle pickups and deliveries. You track everything on WhatsApp.',
  },
];

const FAQS = [
  {
    question: 'What logistics services does Liftngo offer for hotels?',
    answer: 'Liftngo provides daily supply delivery, linen and laundry transport, guest luggage handling, vendor pickups, emergency supplies, and scheduled inventory restocking for hotels and dharamshalas.',
  },
  {
    question: 'How much does hotel logistics service cost?',
    answer: 'Our hotel logistics services start from ₹50 per delivery. We also offer monthly subscription plans for hotels with regular delivery needs, providing 20-30% cost savings compared to per-trip pricing.',
  },
  {
    question: 'Do you provide 24/7 delivery for hotels?',
    answer: 'Yes, we understand hotels operate round the clock. Our delivery services are available 24/7, including early morning supplies before breakfast service and late-night emergencies.',
  },
  {
    question: 'Can you handle bulk deliveries for large hotels?',
    answer: 'Absolutely. We have 3-wheeler and 4-wheeler vehicles for bulk deliveries. For very large orders or events, we can coordinate multiple vehicles simultaneously to ensure timely delivery.',
  },
  {
    question: 'Do you serve hotels in Khatu Shyam Ji area?',
    answer: 'Yes, Khatu Shyam Ji is our primary service area. We serve all hotels, dharamshalas, and guest houses around the temple and surrounding localities including Reengus and Sikar.',
  },
];

export default function HotelLogisticsPartnerPage() {
  const whatsappNumber = SUPPORT_PHONE || '918580584898';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi%20Liftngo%2C%20I%20run%20a%20hotel%20and%20need%20logistics%20support`;

  return (
    <ContentLayout breadcrumbs={[{ name: 'Hotel Logistics Partner', path: PATH }]}>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2C2D5B] to-[#1a1b3a] text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              <Building2 className="h-4 w-4" />
              Hospitality Logistics
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Dedicated Logistics Partner for Hotels
            </h1>
            <p className="mt-6 text-lg text-white/80 sm:text-xl">
              From daily supplies to guest services — we handle all your hotel logistics so you can 
              focus on hospitality. Serving Khatu, Rajasthan & Delhi NCR.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center gap-3 rounded-full bg-green-500 px-8 text-lg font-bold text-white shadow-lg transition-all hover:bg-green-600"
              >
                <MessageCircle className="h-5 w-5" />
                Partner With Us
              </Link>
              <Link
                href={ROUTES.CONTACT}
                className="inline-flex h-14 items-center gap-2 rounded-full border-2 border-white/30 px-8 text-lg font-semibold text-white transition-all hover:bg-white/10"
              >
                Contact Sales
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
            50+ Hotel Partners
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            24/7 Service
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            From ₹50/delivery
          </span>
          <span className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            GST Billing
          </span>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Logistics Services for Hotels & Dharamshalas
            </h2>
            <p className="mt-4 text-gray-600">
              Everything your property needs — delivered on time, every time
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#2C2D5B]/10 text-[#2C2D5B]">
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                <p className="mt-2 text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="prose prose-lg mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900">
              Why Hotels Choose Liftngo as Their Logistics Partner
            </h2>
            <p>
              Running a hotel or dharamshala involves countless logistics challenges — from ensuring 
              fresh supplies reach the kitchen before breakfast to handling last-minute guest requests. 
              Most properties either burden their staff with delivery runs or maintain expensive 
              in-house vehicles.
            </p>
            <p>
              Liftngo offers a better solution. As your <strong>dedicated hotel logistics partner</strong>, 
              we handle all your delivery needs while you focus on what matters most — guest experience. 
              Our services start from just <strong>₹50 per delivery</strong>, and we offer subscription 
              plans for properties with regular needs.
            </p>
            <p>
              In Khatu Shyam Ji, we understand the unique demands of pilgrimage hospitality. During 
              peak seasons and melas, your supply needs can spike dramatically. Our flexible fleet 
              of 2W, 3W, and 4W vehicles scales with your requirements.
            </p>

            <h3 className="text-xl font-bold text-gray-900">
              Tailored for Hospitality Operations
            </h3>
            <p>
              Unlike generic delivery services, we understand hotel operations:
            </p>
            <ul>
              <li><strong>Early Morning Deliveries:</strong> Fresh supplies before your kitchen opens</li>
              <li><strong>Scheduled Runs:</strong> Daily linen pickup and delivery at fixed times</li>
              <li><strong>Vendor Consolidation:</strong> We collect from multiple vendors in one trip</li>
              <li><strong>Guest Services:</strong> Luggage transfers, shopping pickups, medicine runs</li>
              <li><strong>Emergency Response:</strong> 24/7 availability for urgent requirements</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Key Benefits for Your Property
            </h2>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#2C2D5B] text-white">
                  <benefit.icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{benefit.title}</h3>
                <p className="mt-2 text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              How to Partner with Liftngo
            </h2>
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
      <section className="bg-gray-50">
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
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-center text-xl font-bold text-gray-900">
            Related Services
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/restaurant-delivery-partner"
              className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-200"
            >
              <UtensilsCrossed className="h-4 w-4" />
              Restaurant Delivery Partner
            </Link>
            <Link
              href="/b2b-logistics-rajasthan"
              className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-200"
            >
              <Package className="h-4 w-4" />
              B2B Logistics Rajasthan
            </Link>
            <Link
              href={ROUTES.KHATU_SHYAM_LOGISTICS}
              className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-200"
            >
              <MapPin className="h-4 w-4" />
              Khatu Shyam Logistics
            </Link>
            <Link
              href={ROUTES.FARE_CALCULATOR}
              className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-200"
            >
              <IndianRupee className="h-4 w-4" />
              Calculate Delivery Fare
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#2C2D5B]">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Let&apos;s Simplify Your Hotel Logistics
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Join 50+ hotels and dharamshalas who trust Liftngo for their daily logistics. 
            Get a free consultation and custom quote today.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center gap-3 rounded-full bg-green-500 px-8 text-lg font-bold text-white shadow-lg transition-all hover:bg-green-600"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp Us
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
