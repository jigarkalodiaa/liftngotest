import { Metadata } from 'next';
import Link from 'next/link';
import {
  Package,
  Truck,
  Shield,
  Clock,
  CheckCircle,
  Home,
  Building2,
  Box,
  Users,
  Phone,
  MessageCircle,
  ArrowRight,
  Star,
  MapPin,
} from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_URL, SITE_NAME } from '@/lib/site';
import { SUPPORT_PHONE } from '@/config/env';
import ContentLayout from '@/components/layout/ContentLayout';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = generatePageMetadata({
  title: 'Home Shifting Services in Noida | Packers and Movers — Liftngo',
  description:
    'Affordable home shifting and packers and movers service in Noida & Delhi NCR. Professional house shifting, packing and moving services with verified movers. Get instant quotes.',
  path: '/services/home-shifting',
  keywords: [
    'packers and movers',
    'packers and movers near me',
    'packers and movers noida',
    'home shifting services',
    'home shifting services near me',
    'house shifting services',
    'house shifting services near me',
    'packing and moving services',
    'moving services noida',
    'relocation services',
    'furniture shifting',
    'office shifting',
    'local shifting noida',
    'domestic relocation',
  ],
});

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Home Shifting & Packers and Movers Service',
  provider: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
  serviceType: 'Home Shifting',
  areaServed: ['Noida', 'Delhi', 'Gurgaon', 'Greater Noida', 'Ghaziabad', 'Delhi NCR'],
  description:
    'Professional home shifting and packers and movers service in Noida & Delhi NCR. Includes packing, loading, transport, unloading, and unpacking.',
  offers: {
    '@type': 'Offer',
    priceCurrency: 'INR',
    price: '2999',
    priceValidUntil: '2025-12-31',
    availability: 'https://schema.org/InStock',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much do packers and movers charge in Noida?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Home shifting costs in Noida start from ₹2,999 for a 1BHK local move. Prices vary based on distance, volume of goods, and additional services like packing materials. Get an instant quote on Liftngo.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does home shifting service work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our home shifting service includes: 1) Free survey and quote, 2) Professional packing with quality materials, 3) Safe loading and transport, 4) Careful unloading at destination, 5) Unpacking and arrangement assistance.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you provide packing materials for house shifting?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Liftngo provides all packing materials including moving boxes, bubble wrap, packing tape, and protective covers for furniture. Premium packing materials are included in our full-service packages.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my furniture insured during shifting?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, all home shifting services include basic transit insurance. Additional comprehensive insurance coverage is available for valuable items and electronics.',
      },
    },
  ],
};

const SHIFTING_SERVICES = [
  {
    icon: Home,
    title: 'Home Shifting',
    description: 'Complete house relocation service for 1BHK to 4BHK homes with professional packing and safe transport.',
  },
  {
    icon: Building2,
    title: 'Office Shifting',
    description: 'Efficient office relocation with minimal downtime. IT equipment, furniture, and documents handled with care.',
  },
  {
    icon: Box,
    title: 'Packing Services',
    description: 'Professional packing using quality materials — boxes, bubble wrap, and protective covers for all items.',
  },
  {
    icon: Truck,
    title: 'Vehicle Transport',
    description: 'Safe car and bike transport to your new location. Enclosed carriers available for premium vehicles.',
  },
];

const PROCESS_STEPS = [
  {
    step: 1,
    title: 'Get Free Quote',
    description: 'Share your shifting requirements via WhatsApp or call. Get instant transparent pricing.',
  },
  {
    step: 2,
    title: 'Schedule Survey',
    description: 'Our team visits your home to assess items and provide accurate final quote.',
  },
  {
    step: 3,
    title: 'Professional Packing',
    description: 'Trained packers carefully pack all items using quality moving boxes and materials.',
  },
  {
    step: 4,
    title: 'Safe Transport',
    description: 'Goods loaded carefully and transported in covered vehicles with GPS tracking.',
  },
  {
    step: 5,
    title: 'Unpack & Settle',
    description: 'Items unloaded, unpacked, and arranged at your new home. Debris cleared.',
  },
];

const FAQS = [
  {
    question: 'How much do packers and movers charge in Noida?',
    answer:
      'Home shifting costs in Noida start from ₹2,999 for a 1BHK local move (within 10km). For inter-city moves, prices start from ₹7,999. Final cost depends on distance, volume of goods, floor level, and additional services. Get an instant quote on Liftngo app or WhatsApp.',
  },
  {
    question: 'How does home shifting service work?',
    answer:
      'Our home shifting service is simple: 1) Request a quote via WhatsApp or app, 2) We conduct a free home survey, 3) Professional packers arrive on moving day with all materials, 4) Items are carefully packed, loaded, and transported, 5) At destination, we unload, unpack, and help arrange. The entire process is tracked and insured.',
  },
  {
    question: 'Do you provide packing materials for house shifting?',
    answer:
      'Yes, Liftngo provides all necessary packing materials including sturdy moving boxes (various sizes), bubble wrap for fragile items, packing tape, stretch wrap for furniture, mattress covers, and wardrobe boxes for clothes. Premium packing materials are included in our full-service shifting packages.',
  },
  {
    question: 'Is my furniture insured during shifting?',
    answer:
      'Yes, all home shifting services include basic transit insurance covering damage during loading, transport, and unloading. For high-value items like electronics, antiques, or expensive furniture, we offer additional comprehensive insurance at nominal cost.',
  },
  {
    question: 'How far in advance should I book packers and movers?',
    answer:
      'We recommend booking 3-5 days in advance for local shifting and 7-10 days for inter-city moves. However, we also accommodate urgent same-day or next-day shifting requests based on availability. Weekend slots fill up faster, so book early for Saturday/Sunday moves.',
  },
  {
    question: 'Do you handle fragile and valuable items?',
    answer:
      'Yes, our trained packers specialize in handling fragile items like glassware, electronics, artwork, and antiques. We use specialized packing materials and techniques. For extremely valuable items, we recommend our premium white-glove service with additional insurance.',
  },
];

export default function HomeShiftingPage() {
  const whatsappNumber = SUPPORT_PHONE || '918580584898';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi Liftngo, I need home shifting service. Please share quote.')}`;

  return (
    <ContentLayout
      breadcrumbs={[
        { name: 'Services', path: '/services' },
        { name: 'Home Shifting', path: '/services/home-shifting' },
      ]}
    >
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold">
              <Package className="h-4 w-4" />
              PACKERS AND MOVERS
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Affordable Home Shifting &amp; Packers and Movers Service
            </h1>
            <p className="mt-6 text-lg text-white/90 sm:text-xl">
              Professional house shifting services in Noida &amp; Delhi NCR. From packing to unpacking, 
              we handle your entire move with care. Verified movers, quality materials, and transparent pricing.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center gap-3 rounded-full bg-green-500 px-8 text-lg font-bold text-white shadow-lg transition-all hover:bg-green-600"
              >
                <MessageCircle className="h-5 w-5" />
                Get Free Quote
              </Link>
              <a
                href={`tel:+${whatsappNumber}`}
                className="inline-flex h-14 items-center gap-2 rounded-full bg-white px-8 text-lg font-semibold text-gray-900 shadow-lg transition-all hover:bg-gray-50"
              >
                <Phone className="h-5 w-5" />
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8">
            <div className="text-center">
              <div className="text-3xl font-black text-blue-600 sm:text-4xl">5000+</div>
              <div className="text-sm text-gray-600">Homes Shifted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-blue-600 sm:text-4xl">₹2999</div>
              <div className="text-sm text-gray-600">Starting Price</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-blue-600 sm:text-4xl">4.8★</div>
              <div className="text-sm text-gray-600">Customer Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-blue-600 sm:text-4xl">100%</div>
              <div className="text-sm text-gray-600">Insured Moves</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            House Shifting Services Near You
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">
            Complete packing and moving services for homes and offices in Noida, Delhi, Gurgaon, and across NCR.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SHIFTING_SERVICES.map((service) => (
              <div
                key={service.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <service.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                <p className="mt-2 text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            What&apos;s Included in Our Moving Service
          </h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Packing Materials Provided</h3>
              <ul className="space-y-3">
                {[
                  'Sturdy corrugated moving boxes (all sizes)',
                  'Bubble wrap for fragile items',
                  'Packing tape and stretch wrap',
                  'Furniture covers and mattress protectors',
                  'Wardrobe boxes for clothes',
                  'Specialty boxes for electronics',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Services Included</h3>
              <ul className="space-y-3">
                {[
                  'Free home survey and accurate quote',
                  'Professional packing by trained staff',
                  'Careful loading with proper equipment',
                  'GPS-tracked transport in covered vehicles',
                  'Unloading and basic arrangement',
                  'Transit insurance coverage',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Packing and Moving Services — How We Work
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-5">
            {PROCESS_STEPS.map((step, index) => (
              <div key={step.step} className="relative text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{step.description}</p>
                {index < PROCESS_STEPS.length - 1 && (
                  <ArrowRight className="absolute right-0 top-7 hidden h-6 w-6 -translate-x-1/2 text-gray-300 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Areas */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Home Shifting Services Near Me — Coverage Areas
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              'Noida',
              'Greater Noida',
              'Delhi',
              'Gurgaon',
              'Ghaziabad',
              'Faridabad',
              'Indirapuram',
              'Vaishali',
              'Dwarka',
              'Rohini',
              'Saket',
              'Nehru Place',
            ].map((area) => (
              <span
                key={area}
                className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
              >
                <MapPin className="h-3 w-3" />
                {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-8 space-y-4">
            {FAQS.map((faq, index) => (
              <details key={index} className="group rounded-xl border border-gray-200 bg-white">
                <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-gray-900">
                  {faq.question}
                  <ArrowRight className="h-5 w-5 rotate-90 transition-transform group-open:rotate-[270deg]" />
                </summary>
                <div className="border-t border-gray-100 px-5 py-4 text-gray-600">{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to Move? Get Your Free Quote Today
          </h2>
          <p className="mt-4 text-lg text-white/90">
            Professional packers and movers at your doorstep. Transparent pricing, no hidden charges.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center gap-3 rounded-full bg-green-500 px-8 text-lg font-bold text-white shadow-lg transition-all hover:bg-green-600"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp Quote
            </Link>
            <a
              href={`tel:+${whatsappNumber}`}
              className="inline-flex h-14 items-center gap-2 rounded-full bg-white px-8 text-lg font-semibold text-gray-900 shadow-lg transition-all hover:bg-gray-50"
            >
              <Phone className="h-5 w-5" />
              Call for Quote
            </a>
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:shadow-md"
            >
              All Services
            </Link>
            <Link
              href="/partner"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:shadow-md"
            >
              Become a Partner
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:shadow-md"
            >
              Contact Support
            </Link>
            <Link
              href="/fare-calculator"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:shadow-md"
            >
              Calculate Fare
            </Link>
          </div>
        </div>
      </section>
    </ContentLayout>
  );
}
