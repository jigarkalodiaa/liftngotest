import { Metadata } from 'next';
import Link from 'next/link';
import {
  MessageCircle,
  Clock,
  Shield,
  MapPin,
  Phone,
  CheckCircle,
  ArrowRight,
  Package,
  Zap,
  IndianRupee,
  Smartphone,
  Send,
  Image as ImageIcon,
} from 'lucide-react';
import ContentLayout from '@/components/layout/ContentLayout';
import JsonLd from '@/components/JsonLd';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_URL, SITE_NAME } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import { SUPPORT_PHONE } from '@/config/env';

const PATH = '/whatsapp-delivery-service';
const PAGE_URL = `${SITE_URL}${PATH}`;

export const metadata: Metadata = generatePageMetadata({
  title: 'WhatsApp Delivery Service — No App Needed',
  description:
    'Order deliveries on WhatsApp — no app download needed. Send pickup & drop location, get instant quote, track live. Serving Khatu, Rajasthan & Delhi NCR.',
  path: PATH,
  keywords: [
    'WhatsApp delivery service',
    'delivery on WhatsApp',
    'no app delivery',
    'WhatsApp logistics',
    'instant delivery WhatsApp',
    'book delivery WhatsApp',
    'Khatu WhatsApp delivery',
    'easy delivery booking',
    'chat delivery service',
  ],
});

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${PAGE_URL}/#service`,
  name: 'WhatsApp Delivery Service — Liftngo',
  url: PAGE_URL,
  description:
    'Book deliveries via WhatsApp without downloading any app. Send locations, get quotes, and track deliveries — all in your favorite chat app.',
  serviceType: 'On-Demand Delivery',
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
    '@type': 'Offer',
    priceCurrency: 'INR',
    price: '50',
    availability: 'https://schema.org/InStock',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'WhatsApp Delivery Service', item: PAGE_URL },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I book a delivery on WhatsApp?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Simply message us at +91 85805 84898 with your pickup location, drop location, and what you need delivered. We will send you an instant quote and assign a driver.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to download any app?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No app download required. Everything works through WhatsApp — booking, tracking, and payment confirmation. Just use the WhatsApp you already have.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I share my live location for pickup?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! You can share your live location or drop a pin on WhatsApp. This helps our driver find you quickly, especially in areas without clear addresses.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I track my delivery on WhatsApp?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Once a driver is assigned, we share their contact and live location. You can track them directly on WhatsApp and communicate if needed.',
      },
    },
    {
      '@type': 'Question',
      name: 'What payment methods are accepted?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can pay cash on delivery, UPI (GPay, PhonePe, Paytm), or prepay via our payment link. We send the payment link on WhatsApp itself.',
      },
    },
  ],
};

const STEPS = [
  {
    icon: MessageCircle,
    title: 'Message Us',
    description: 'Send "Hi" to +91 85805 84898 on WhatsApp. Share pickup & drop location.',
  },
  {
    icon: IndianRupee,
    title: 'Get Instant Quote',
    description: 'We calculate fare based on distance and vehicle type. No hidden charges.',
  },
  {
    icon: Send,
    title: 'Driver Assigned',
    description: 'A verified driver is assigned. You get their details and live location.',
  },
  {
    icon: Package,
    title: 'Delivery Complete',
    description: 'Track in real-time. Pay on delivery or prepay online. Done!',
  },
];

const BENEFITS = [
  {
    icon: Smartphone,
    title: 'No App Download',
    description: 'Use the WhatsApp you already have. No new apps, no sign-ups, no OTPs.',
  },
  {
    icon: MapPin,
    title: 'Share Live Location',
    description: 'Drop a pin or share live location. Perfect for areas without clear addresses.',
  },
  {
    icon: ImageIcon,
    title: 'Send Photos',
    description: 'Share photos of your package. Helps driver identify and handle correctly.',
  },
  {
    icon: Clock,
    title: 'Instant Response',
    description: 'Get quotes and driver assignment within minutes. No waiting.',
  },
  {
    icon: Shield,
    title: 'Direct Communication',
    description: 'Chat directly with your driver. Coordinate pickup and drop easily.',
  },
  {
    icon: Zap,
    title: 'Quick Repeat Orders',
    description: 'Just forward your last message to reorder. We remember your preferences.',
  },
];

const FAQS = [
  {
    question: 'How do I book a delivery on WhatsApp?',
    answer: 'Simply message us at +91 85805 84898 with your pickup location, drop location, and what you need delivered. You can type the address, share a Google Maps link, or drop a pin. We will send you an instant quote and assign a driver within minutes.',
  },
  {
    question: 'Do I need to download any app?',
    answer: 'No app download required. Everything works through WhatsApp — booking, tracking, and payment confirmation. Just use the WhatsApp you already have on your phone. This is perfect for quick one-time deliveries or if you prefer not to install new apps.',
  },
  {
    question: 'Can I share my live location for pickup?',
    answer: 'Yes! You can share your live location or drop a pin on WhatsApp. This helps our driver find you quickly, especially in areas without clear addresses like new colonies, temple areas, or rural locations.',
  },
  {
    question: 'How do I track my delivery on WhatsApp?',
    answer: 'Once a driver is assigned, we share their name, phone number, and vehicle details. The driver can share their live location with you. You can also call or message them directly for updates.',
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'You can pay cash on delivery, UPI (GPay, PhonePe, Paytm), or prepay via our payment link. We send the payment link on WhatsApp itself. For business accounts, we also offer monthly billing.',
  },
];

export default function WhatsAppDeliveryServicePage() {
  const whatsappNumber = SUPPORT_PHONE || '918580584898';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi%20Liftngo%2C%20I%20need%20a%20delivery`;

  return (
    <ContentLayout breadcrumbs={[{ name: 'WhatsApp Delivery Service', path: PATH }]}>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-500 to-green-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold">
              <MessageCircle className="h-4 w-4" />
              NO APP NEEDED
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Order Deliveries on WhatsApp
              <span className="block text-white/90">No App Download Required</span>
            </h1>
            <p className="mt-6 text-lg text-white/90 sm:text-xl">
              Just message us your pickup and drop location. Get instant quote, track live, 
              and pay on delivery. Starting at <strong className="text-yellow-200">₹50</strong>.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center gap-3 rounded-full bg-white px-8 text-lg font-bold text-green-600 shadow-lg transition-all hover:bg-green-50"
              >
                <MessageCircle className="h-6 w-6" />
                Message Us Now
              </Link>
              <div className="text-lg font-semibold text-white/90">
                +91 85805 84898
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              How WhatsApp Delivery Works
            </h2>
            <p className="mt-4 text-gray-600">
              4 simple steps — all on WhatsApp
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <div key={step.title} className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white">
                  <step.icon className="h-8 w-8" />
                </div>
                <div className="absolute left-1/2 top-8 hidden h-0.5 w-full -translate-x-1/2 bg-green-200 lg:block" style={{ display: index === 3 ? 'none' : undefined }} />
                <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="prose prose-lg mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900">
              Why Book Delivery on WhatsApp?
            </h2>
            <p>
              We get it — you don&apos;t want to download another app for a one-time delivery. 
              You don&apos;t want to create an account, verify OTPs, and navigate unfamiliar 
              interfaces. You just want to get something delivered.
            </p>
            <p>
              That&apos;s why Liftngo works on <strong>WhatsApp</strong> — the app you already 
              use every day. No downloads, no sign-ups, no learning curve. Just message us 
              like you&apos;d message a friend.
            </p>
            <p>
              Our WhatsApp delivery service is perfect for:
            </p>
            <ul>
              <li><strong>One-time deliveries:</strong> When you don&apos;t want to install an app for a single use</li>
              <li><strong>Older users:</strong> Who are comfortable with WhatsApp but not new apps</li>
              <li><strong>Quick bookings:</strong> When you need a delivery in seconds, not minutes</li>
              <li><strong>Areas without clear addresses:</strong> Share live location instead of typing addresses</li>
              <li><strong>Business users:</strong> Quick repeat orders by forwarding previous messages</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900">
              What Can You Send Via WhatsApp Delivery?
            </h3>
            <p>
              Our WhatsApp delivery service handles the same cargo as our app — from small 
              documents to bulk goods:
            </p>
            <ul>
              <li>Documents, parcels, and small packages</li>
              <li>Food orders and restaurant deliveries</li>
              <li>Groceries and daily essentials</li>
              <li>Medicine and pharmacy items</li>
              <li>Shop inventory and supplies</li>
              <li>Gifts and personal items</li>
              <li>Bulk goods (using 3W or 4W vehicles)</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900">
              Pricing — Same as App, No Extra Charges
            </h3>
            <p>
              WhatsApp delivery costs the same as booking through our app or website. 
              Starting from <strong>₹50 for local deliveries</strong> in Khatu, and 
              ₹80-₹150 for longer distances. We calculate the exact fare based on 
              distance and vehicle type, and share it before you confirm.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Key Benefits of WhatsApp Delivery
            </h2>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{benefit.title}</h3>
                <p className="mt-2 text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Conversation */}
      <section className="bg-green-50">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Sample WhatsApp Conversation
          </h2>
          <div className="space-y-4 rounded-2xl bg-white p-6 shadow-lg">
            {/* User message */}
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-green-500 px-4 py-3 text-white">
                Hi, I need a delivery from Khatu Temple to Hotel Shyam Palace
              </div>
            </div>
            {/* Bot response */}
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-3 text-gray-800">
                Hi! 👋 Thanks for reaching out to Liftngo.<br /><br />
                📍 Pickup: Khatu Temple<br />
                📍 Drop: Hotel Shyam Palace<br />
                📏 Distance: ~2 km<br /><br />
                💰 Fare: ₹60 (2-wheeler)<br /><br />
                Shall I assign a driver?
              </div>
            </div>
            {/* User message */}
            <div className="flex justify-end">
              <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-green-500 px-4 py-3 text-white">
                Yes, please
              </div>
            </div>
            {/* Bot response */}
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-3 text-gray-800">
                ✅ Driver assigned!<br /><br />
                🏍️ Raju Kumar<br />
                📞 +91 98765 43210<br />
                🚗 Honda Activa (RJ-23-AB-1234)<br /><br />
                ETA: 8 minutes<br />
                He will share live location shortly.
              </div>
            </div>
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
            Explore More Services
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={ROUTES.BOOK_DELIVERY}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:shadow-md"
            >
              <Package className="h-4 w-4" />
              Book via Website
            </Link>
            <Link
              href="/same-day-delivery-khatu"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:shadow-md"
            >
              <Zap className="h-4 w-4" />
              Same Day Delivery
            </Link>
            <Link
              href={ROUTES.FARE_CALCULATOR}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:shadow-md"
            >
              <IndianRupee className="h-4 w-4" />
              Calculate Fare
            </Link>
            <Link
              href={ROUTES.CONTACT}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:shadow-md"
            >
              <Phone className="h-4 w-4" />
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-500">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to Try WhatsApp Delivery?
          </h2>
          <p className="mt-4 text-lg text-white/90">
            Just send us a message. No app, no sign-up, no hassle.
          </p>
          <div className="mt-8">
            <Link
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center gap-3 rounded-full bg-white px-8 text-lg font-bold text-green-600 shadow-lg transition-all hover:bg-green-50"
            >
              <MessageCircle className="h-6 w-6" />
              Start Chat on WhatsApp
            </Link>
          </div>
          <p className="mt-6 text-lg font-semibold text-white">
            +91 85805 84898
          </p>
        </div>
      </section>
    </ContentLayout>
  );
}
