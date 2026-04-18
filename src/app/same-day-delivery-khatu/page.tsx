import { Metadata } from 'next';
import Link from 'next/link';
import {
  Truck,
  Clock,
  Shield,
  MapPin,
  Phone,
  CheckCircle,
  ArrowRight,
  Package,
  Zap,
  IndianRupee,
  MessageCircle,
  Timer,
} from 'lucide-react';
import ContentLayout from '@/components/layout/ContentLayout';
import JsonLd from '@/components/JsonLd';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_URL, SITE_NAME } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import { SUPPORT_PHONE } from '@/config/env';

const PATH = '/same-day-delivery-khatu';
const PAGE_URL = `${SITE_URL}${PATH}`;

export const metadata: Metadata = generatePageMetadata({
  title: 'Same Day Delivery Khatu — 15 to 25 Minutes',
  description:
    'Same day delivery in Khatu Shyam Ji in 15-25 minutes. Urgent goods transport for hotels, shops, and temples. Starting ₹50. Book via WhatsApp now.',
  path: PATH,
  keywords: [
    'same day delivery Khatu',
    'urgent delivery Khatu Shyam',
    'fast delivery Khatu',
    'express delivery Khatu',
    '15 minute delivery Khatu',
    'quick delivery Khatu Shyam Ji',
    'instant delivery Khatu',
    'Khatu local delivery',
    'emergency delivery Khatu',
  ],
});

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${PAGE_URL}/#service`,
  name: 'Same Day Delivery Khatu — Liftngo',
  url: PAGE_URL,
  description:
    'Ultra-fast same day delivery in Khatu Shyam Ji. Get your goods delivered in 15-25 minutes with verified drivers and real-time tracking.',
  serviceType: 'Express Delivery Service',
  areaServed: {
    '@type': 'Place',
    name: 'Khatu Shyam Ji, Rajasthan',
    geo: { '@type': 'GeoCoordinates', latitude: 27.7486, longitude: 75.3932 },
  },
  provider: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
  offers: {
    '@type': 'Offer',
    priceCurrency: 'INR',
    price: '50',
    priceValidUntil: '2025-12-31',
    availability: 'https://schema.org/InStock',
    validFrom: '2024-01-01',
  },
  deliveryTime: {
    '@type': 'ShippingDeliveryTime',
    handlingTime: {
      '@type': 'QuantitativeValue',
      minValue: 5,
      maxValue: 10,
      unitCode: 'MIN',
    },
    transitTime: {
      '@type': 'QuantitativeValue',
      minValue: 10,
      maxValue: 15,
      unitCode: 'MIN',
    },
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Same Day Delivery Khatu', item: PAGE_URL },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How fast is same day delivery in Khatu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our same day delivery in Khatu typically takes 15-25 minutes for local deliveries within the temple area and surrounding localities.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the cost of same day delivery in Khatu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Same day delivery in Khatu starts from just ₹50 for short distances. Prices vary based on distance and vehicle type (2W, 3W, or 4W).',
      },
    },
    {
      '@type': 'Question',
      name: 'Is same day delivery available 24/7 in Khatu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, Liftngo provides 24/7 same day delivery services in Khatu Shyam Ji. Our drivers are available round the clock for urgent deliveries.',
      },
    },
    {
      '@type': 'Question',
      name: 'What items can I send via same day delivery?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can send documents, parcels, food items, prasad, hotel supplies, shop inventory, and most non-hazardous goods via our same day delivery service.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I book same day delivery in Khatu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Simply WhatsApp us at +91 85805 84898 with your pickup and drop location. A driver will be assigned within minutes.',
      },
    },
  ],
};

const BENEFITS = [
  {
    icon: Timer,
    title: '15-25 Minute Delivery',
    description: 'Lightning-fast delivery within Khatu Shyam Ji area. Perfect for urgent temple supplies and hotel needs.',
  },
  {
    icon: IndianRupee,
    title: 'Starting ₹50 Only',
    description: 'Affordable same day delivery with transparent pricing. No hidden charges or surge pricing.',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Round-the-clock service for early morning temple runs or late-night emergencies.',
  },
  {
    icon: Shield,
    title: 'Verified Drivers',
    description: 'All delivery partners are background-verified locals who know every lane in Khatu.',
  },
  {
    icon: MapPin,
    title: 'Real-Time Tracking',
    description: 'Track your delivery live on WhatsApp. Know exactly when your goods will arrive.',
  },
  {
    icon: Package,
    title: 'All Cargo Types',
    description: 'From small parcels to bulk supplies — we have 2W, 3W, and 4W vehicles ready.',
  },
];

const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'WhatsApp Your Request',
    description: 'Send pickup location, drop address, and what you need delivered. Photos help!',
  },
  {
    step: 2,
    title: 'Instant Driver Match',
    description: 'We assign the nearest available driver within 2-5 minutes. You get their details.',
  },
  {
    step: 3,
    title: 'Track & Receive',
    description: 'Watch your delivery move in real-time. Pay on delivery or prepay online.',
  },
];

const FAQS = [
  {
    question: 'How fast is same day delivery in Khatu?',
    answer: 'Our same day delivery in Khatu typically takes 15-25 minutes for local deliveries within the temple area and surrounding localities. For slightly farther areas like Sikar, it may take 45-60 minutes.',
  },
  {
    question: 'What is the cost of same day delivery in Khatu?',
    answer: 'Same day delivery in Khatu starts from just ₹50 for short distances (up to 2 km). For longer distances, prices range from ₹80 to ₹150 depending on the vehicle type and cargo size.',
  },
  {
    question: 'Is same day delivery available 24/7 in Khatu?',
    answer: 'Yes, Liftngo provides 24/7 same day delivery services in Khatu Shyam Ji. Our drivers are available round the clock, including during major festivals and melas.',
  },
  {
    question: 'What items can I send via same day delivery?',
    answer: 'You can send documents, parcels, food items, prasad, hotel supplies, shop inventory, groceries, medicines, and most non-hazardous goods. We do not transport alcohol, weapons, or illegal items.',
  },
  {
    question: 'How do I book same day delivery in Khatu?',
    answer: 'Simply WhatsApp us at +91 85805 84898 with your pickup and drop location. You can also use our app or website to book. A driver will be assigned within 2-5 minutes.',
  },
];

export default function SameDayDeliveryKhatuPage() {
  const whatsappNumber = SUPPORT_PHONE || '918580584898';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi%20Liftngo%2C%20I%20need%20same%20day%20delivery%20in%20Khatu`;

  return (
    <ContentLayout breadcrumbs={[{ name: 'Same Day Delivery Khatu', path: PATH }]}>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold">
              <Zap className="h-4 w-4" />
              EXPRESS DELIVERY
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Same Day Delivery in Khatu
              <span className="block text-white/90">15 to 25 Minutes</span>
            </h1>
            <p className="mt-6 text-lg text-white/90 sm:text-xl">
              Urgent goods delivery in Khatu Shyam Ji — from temple supplies to hotel inventory. 
              Starting at just <strong className="text-yellow-200">₹50</strong>. Available 24/7.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center gap-3 rounded-full bg-green-500 px-8 text-lg font-bold text-white shadow-lg transition-all hover:bg-green-600"
              >
                <MessageCircle className="h-5 w-5" />
                Book Now on WhatsApp
              </Link>
              <Link
                href={ROUTES.FARE_CALCULATOR}
                className="inline-flex h-14 items-center gap-2 rounded-full bg-white px-8 text-lg font-semibold text-orange-600 shadow-lg transition-all hover:bg-orange-50"
              >
                Check Fare
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Speed Stats */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-4 sm:gap-8">
          <div className="text-center">
            <div className="text-3xl font-black text-orange-500 sm:text-4xl">15</div>
            <div className="text-sm text-gray-600">Minutes Avg.</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-orange-500 sm:text-4xl">₹50</div>
            <div className="text-sm text-gray-600">Starting Price</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-orange-500 sm:text-4xl">24/7</div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-orange-500 sm:text-4xl">100+</div>
            <div className="text-sm text-gray-600">Daily Deliveries</div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="prose prose-lg mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900">
              Why Choose Liftngo for Same Day Delivery in Khatu?
            </h2>
            <p>
              Khatu Shyam Ji is one of the busiest pilgrimage destinations in Rajasthan, with thousands of 
              devotees visiting daily. For local businesses — hotels, dharamshalas, prasad shops, and 
              restaurants — <strong>same day delivery</strong> isn&apos;t a luxury, it&apos;s a necessity.
            </p>
            <p>
              Liftngo was built for Khatu. Our drivers know every gali, every shortcut, and every landmark 
              around the temple. When you need supplies delivered in <strong>15-25 minutes</strong>, we 
              make it happen — whether it&apos;s 5 AM before the morning aarti or 11 PM after a busy festival day.
            </p>
            <p>
              Our pricing starts at just <strong>₹50 for local deliveries</strong> within 2 km of the temple. 
              For longer distances to Reengus, Sikar, or nearby villages, our rates remain competitive at 
              ₹80-₹150 depending on the vehicle type.
            </p>

            <h3 className="text-xl font-bold text-gray-900">
              What Can You Deliver Same Day in Khatu?
            </h3>
            <ul>
              <li><strong>Temple Supplies:</strong> Prasad, flowers, pooja items, donation materials</li>
              <li><strong>Hotel & Dharamshala:</strong> Linen, toiletries, food supplies, guest luggage</li>
              <li><strong>Restaurant & Food:</strong> Fresh vegetables, groceries, packaged food, beverages</li>
              <li><strong>Shop Inventory:</strong> Restocking, inter-shop transfers, customer orders</li>
              <li><strong>Documents & Parcels:</strong> Urgent paperwork, small packages, medicines</li>
              <li><strong>Festival Supplies:</strong> Bulk orders during melas and special occasions</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900">
              Coverage Area for Same Day Delivery
            </h3>
            <p>
              Our same day delivery service covers all of Khatu Shyam Ji and surrounding areas:
            </p>
            <ul>
              <li>Khatu Temple Area — 15-20 minutes</li>
              <li>Khatu Bus Stand & Market — 10-15 minutes</li>
              <li>Nearby Villages (5 km radius) — 20-30 minutes</li>
              <li>Reengus — 30-45 minutes</li>
              <li>Sikar City — 45-60 minutes</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Key Benefits of Same Day Delivery
            </h2>
            <p className="mt-4 text-gray-600">
              Fast, reliable, and affordable — everything you need for urgent deliveries
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
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
      <section className="bg-orange-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              How Same Day Delivery Works
            </h2>
            <p className="mt-4 text-gray-600">
              Book in seconds, receive in minutes
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-2xl font-bold text-white">
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
              Book Delivery Now
            </Link>
            <Link
              href="/b2b-logistics-rajasthan"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:shadow-md"
            >
              <Package className="h-4 w-4" />
              B2B Logistics Rajasthan
            </Link>
            <Link
              href={ROUTES.KHATU_SHYAM_LOGISTICS}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:shadow-md"
            >
              <MapPin className="h-4 w-4" />
              Khatu Shyam Logistics
            </Link>
            <Link
              href={ROUTES.FARE_CALCULATOR}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:shadow-md"
            >
              <IndianRupee className="h-4 w-4" />
              Calculate Fare
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-orange-500">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Need Something Delivered Right Now?
          </h2>
          <p className="mt-4 text-lg text-white/90">
            WhatsApp us your pickup and drop location. A driver will be at your doorstep in minutes.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center gap-3 rounded-full bg-green-500 px-8 text-lg font-bold text-white shadow-lg transition-all hover:bg-green-600"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp Now
            </Link>
            {SUPPORT_PHONE && (
              <a
                href={`tel:+${whatsappNumber}`}
                className="inline-flex h-14 items-center gap-2 rounded-full bg-white px-8 text-lg font-semibold text-orange-600 shadow-lg transition-all hover:bg-orange-50"
              >
                <Phone className="h-5 w-5" />
                Call +91 85805 84898
              </a>
            )}
          </div>
        </div>
      </section>
    </ContentLayout>
  );
}
