import { Metadata } from 'next';
import Link from 'next/link';
import {
  UtensilsCrossed,
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
  Bike,
  Timer,
  Leaf,
} from 'lucide-react';
import ContentLayout from '@/components/layout/ContentLayout';
import JsonLd from '@/components/JsonLd';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_URL, SITE_NAME } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import { SUPPORT_PHONE } from '@/config/env';

const PATH = '/restaurant-delivery-partner';
const PAGE_URL = `${SITE_URL}${PATH}`;

export const metadata: Metadata = generatePageMetadata({
  title: 'Restaurant Delivery Partner Rajasthan — Liftngo',
  description:
    'Delivery partner for restaurants and cloud kitchens in Rajasthan. Fast food delivery, kitchen supplies, and vendor pickups. Starting ₹50. No commission model.',
  path: PATH,
  keywords: [
    'restaurant delivery partner Rajasthan',
    'food delivery service Khatu',
    'cloud kitchen delivery',
    'restaurant logistics',
    'food transport service',
    'dhaba delivery partner',
    'kitchen supply delivery',
    'restaurant vendor pickup',
    'F&B logistics India',
    'food business delivery',
  ],
});

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${PAGE_URL}/#service`,
  name: 'Restaurant Delivery Partner — Liftngo',
  url: PAGE_URL,
  description:
    'Delivery partner for restaurants, cloud kitchens, and food businesses. Fast food delivery, kitchen supplies, and vendor pickups across Rajasthan.',
  serviceType: 'Food Delivery Logistics',
  areaServed: [
    { '@type': 'State', name: 'Rajasthan' },
    { '@type': 'Place', name: 'Khatu Shyam Ji' },
    { '@type': 'City', name: 'Sikar' },
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
    highPrice: '150',
    availability: 'https://schema.org/InStock',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Restaurant Delivery Partner', item: PAGE_URL },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Does Liftngo charge commission on food orders?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, Liftngo operates on a flat delivery fee model starting from ₹50. We do not take any commission on your food orders, unlike aggregator platforms.',
      },
    },
    {
      '@type': 'Question',
      name: 'How fast can you deliver food orders?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our average delivery time is 15-25 minutes for local deliveries in Khatu. We prioritize food orders to ensure hot and fresh delivery.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you provide insulated delivery bags?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, our delivery partners carry insulated bags to maintain food temperature during transit. This is especially important for hot meals and cold beverages.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can you handle bulk orders for events and parties?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolutely. We have 3-wheeler and 4-wheeler vehicles for bulk food orders. We can coordinate multiple deliveries for large events.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you also deliver kitchen supplies and ingredients?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we provide complete logistics for restaurants including fresh produce pickup from mandis, vendor supplies, packaging materials, and kitchen equipment.',
      },
    },
  ],
};

const SERVICES = [
  {
    icon: UtensilsCrossed,
    title: 'Food Order Delivery',
    description: 'Fast delivery of prepared meals to customers. Insulated bags for temperature control.',
  },
  {
    icon: Leaf,
    title: 'Fresh Produce Pickup',
    description: 'Daily mandi runs for vegetables, fruits, and fresh ingredients.',
  },
  {
    icon: Package,
    title: 'Kitchen Supplies',
    description: 'Delivery of packaging, disposables, cooking oil, and dry goods from vendors.',
  },
  {
    icon: Bike,
    title: 'Express Delivery',
    description: '15-25 minute delivery for urgent orders within Khatu and nearby areas.',
  },
  {
    icon: Users,
    title: 'Bulk & Catering',
    description: 'Large order handling for parties, events, and corporate catering.',
  },
  {
    icon: Timer,
    title: 'Scheduled Runs',
    description: 'Fixed daily pickups from your regular vendors at set times.',
  },
];

const BENEFITS = [
  {
    icon: IndianRupee,
    title: 'No Commission',
    description: 'Flat ₹50-₹150 per delivery. Keep 100% of your food revenue.',
  },
  {
    icon: Clock,
    title: '15-25 Min Delivery',
    description: 'Fast delivery ensures food reaches customers hot and fresh.',
  },
  {
    icon: Shield,
    title: 'Trained Riders',
    description: 'Our partners understand food handling and customer service.',
  },
  {
    icon: Zap,
    title: 'On-Demand + Scheduled',
    description: 'Book instantly or set up daily delivery schedules.',
  },
];

const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Order Ready Notification',
    description: 'WhatsApp us when an order is ready. Share customer address and any special instructions.',
  },
  {
    step: 2,
    title: 'Rider Pickup',
    description: 'Nearest available rider reaches your kitchen in 5-10 minutes with insulated bag.',
  },
  {
    step: 3,
    title: 'Fast Delivery',
    description: 'Food delivered to customer. You receive confirmation and can track in real-time.',
  },
];

const FAQS = [
  {
    question: 'Does Liftngo charge commission on food orders?',
    answer: 'No, Liftngo operates on a flat delivery fee model starting from ₹50. We do not take any commission on your food orders, unlike aggregator platforms. You keep 100% of your food revenue.',
  },
  {
    question: 'How fast can you deliver food orders?',
    answer: 'Our average delivery time is 15-25 minutes for local deliveries in Khatu. We prioritize food orders to ensure hot and fresh delivery. For longer distances, we provide accurate ETAs upfront.',
  },
  {
    question: 'Do you provide insulated delivery bags?',
    answer: 'Yes, our delivery partners carry insulated bags to maintain food temperature during transit. This is especially important for hot meals, cold beverages, and desserts.',
  },
  {
    question: 'Can you handle bulk orders for events and parties?',
    answer: 'Absolutely. We have 3-wheeler and 4-wheeler vehicles for bulk food orders. We can coordinate multiple deliveries for large events, weddings, and corporate functions.',
  },
  {
    question: 'Do you also deliver kitchen supplies and ingredients?',
    answer: 'Yes, we provide complete logistics for restaurants including fresh produce pickup from mandis, vendor supplies, packaging materials, cooking gas, and kitchen equipment delivery.',
  },
];

export default function RestaurantDeliveryPartnerPage() {
  const whatsappNumber = SUPPORT_PHONE || '918580584898';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi%20Liftngo%2C%20I%20run%20a%20restaurant%20and%20need%20delivery%20partner`;

  return (
    <ContentLayout breadcrumbs={[{ name: 'Restaurant Delivery Partner', path: PATH }]}>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold">
              <UtensilsCrossed className="h-4 w-4" />
              F&B LOGISTICS
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Delivery Partner for Restaurants & Cloud Kitchens
            </h1>
            <p className="mt-6 text-lg text-white/90 sm:text-xl">
              No commission. No aggregator fees. Just fast, reliable food delivery starting at 
              <strong className="text-yellow-200"> ₹50</strong>. Keep 100% of your revenue.
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
                href={ROUTES.FARE_CALCULATOR}
                className="inline-flex h-14 items-center gap-2 rounded-full bg-white px-8 text-lg font-semibold text-orange-600 shadow-lg transition-all hover:bg-orange-50"
              >
                Check Delivery Rates
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Strip */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
            <div>
              <div className="text-2xl font-black text-green-500">₹0</div>
              <div className="text-sm text-gray-600">Commission</div>
            </div>
            <div>
              <div className="text-2xl font-black text-orange-500">₹50</div>
              <div className="text-sm text-gray-600">Starting Price</div>
            </div>
            <div>
              <div className="text-2xl font-black text-orange-500">15 min</div>
              <div className="text-sm text-gray-600">Avg. Delivery</div>
            </div>
            <div>
              <div className="text-2xl font-black text-orange-500">100%</div>
              <div className="text-sm text-gray-600">Your Revenue</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Complete Logistics for Food Businesses
            </h2>
            <p className="mt-4 text-gray-600">
              From customer deliveries to kitchen supplies — we handle it all
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
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
              Why Restaurants Choose Liftngo Over Aggregators
            </h2>
            <p>
              Food aggregator platforms charge 20-30% commission on every order. For a ₹500 order, 
              you lose ₹100-150 to the platform. Over a month, this adds up to lakhs of rupees 
              that should be in your pocket.
            </p>
            <p>
              Liftngo offers a different model. We charge a <strong>flat delivery fee starting 
              from ₹50</strong> — no commission, no hidden charges. Whether your order is ₹200 
              or ₹2000, you keep 100% of the food revenue.
            </p>
            <p>
              For restaurants in Khatu Shyam Ji, this is especially valuable. Pilgrims and 
              tourists order frequently, and every rupee saved on delivery commission goes 
              directly to your bottom line.
            </p>

            <h3 className="text-xl font-bold text-gray-900">
              Perfect for These Food Businesses
            </h3>
            <ul>
              <li><strong>Restaurants & Dhabas:</strong> Customer order delivery, bulk catering</li>
              <li><strong>Cloud Kitchens:</strong> High-volume delivery without platform dependency</li>
              <li><strong>Sweet Shops:</strong> Prasad and mithai delivery to devotees</li>
              <li><strong>Bakeries:</strong> Fresh bread, cakes, and pastry delivery</li>
              <li><strong>Tiffin Services:</strong> Daily meal delivery to regular customers</li>
              <li><strong>Catering:</strong> Event and party food transport</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900">
              Beyond Customer Delivery
            </h3>
            <p>
              Running a food business requires more than just customer delivery. You need fresh 
              ingredients daily, packaging supplies, and vendor coordination. Liftngo handles 
              all of this:
            </p>
            <ul>
              <li>Early morning mandi runs for fresh vegetables and fruits</li>
              <li>Vendor pickups for packaging, disposables, and dry goods</li>
              <li>Emergency supplies when you run out of something mid-service</li>
              <li>Equipment and gas cylinder delivery</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-orange-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Key Benefits for Your Restaurant
            </h2>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((benefit) => (
              <div key={benefit.title} className="text-center">
                <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white">
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
              How Food Delivery Works
            </h2>
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
              href="/hotel-logistics-partner"
              className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-200"
            >
              <Package className="h-4 w-4" />
              Hotel Logistics Partner
            </Link>
            <Link
              href="/same-day-delivery-khatu"
              className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-200"
            >
              <Zap className="h-4 w-4" />
              Same Day Delivery Khatu
            </Link>
            <Link
              href="/b2b-logistics-rajasthan"
              className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-200"
            >
              <Package className="h-4 w-4" />
              B2B Logistics Rajasthan
            </Link>
            <Link
              href={ROUTES.FARE_CALCULATOR}
              className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-200"
            >
              <IndianRupee className="h-4 w-4" />
              Calculate Fare
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-orange-500 to-red-500">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Stop Paying Commission. Start Keeping Your Revenue.
          </h2>
          <p className="mt-4 text-lg text-white/90">
            Join restaurants across Rajasthan who switched to Liftngo for commission-free delivery. 
            Get started with a free trial today.
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
                className="inline-flex h-14 items-center gap-2 rounded-full bg-white px-8 text-lg font-semibold text-orange-600 shadow-lg transition-all hover:bg-orange-50"
              >
                <Phone className="h-5 w-5" />
                Call Now
              </a>
            )}
          </div>
          <p className="mt-6 text-sm text-white/70">
            WhatsApp: +91 85805 84898 • No setup fees • Start same day
          </p>
        </div>
      </section>
    </ContentLayout>
  );
}
