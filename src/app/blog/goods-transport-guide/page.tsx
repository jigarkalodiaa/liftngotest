import { Metadata } from 'next';
import Link from 'next/link';
import {
  Truck,
  Package,
  Clock,
  Shield,
  MapPin,
  CheckCircle,
  ArrowRight,
  Phone,
  MessageCircle,
  Bike,
  Car,
} from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_URL, SITE_NAME } from '@/lib/site';
import { SUPPORT_PHONE } from '@/config/env';
import ContentLayout from '@/components/layout/ContentLayout';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = generatePageMetadata({
  title: 'Complete Guide to Goods Transport Service in India — Liftngo',
  description:
    'Learn everything about goods transport services in India. Types of delivery vehicles, how to book, charges per km, same day delivery, and tips for safe transport.',
  path: '/blog/goods-transport-guide',
  keywords: [
    'goods transport services',
    'delivery transport',
    'transportation services',
    'how to book delivery',
    'delivery charges per km',
    'same day delivery',
    'mini truck booking',
    'tempo booking',
    'bike delivery service',
    'courier service',
    'logistics services',
  ],
});

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Complete Guide to Goods Transport Service in India',
  description:
    'Comprehensive guide covering goods transport services, vehicle types, booking process, charges, and tips for safe delivery.',
  author: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
  publisher: {
    '@type': 'Organization',
    name: SITE_NAME,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo.png`,
    },
  },
  datePublished: '2024-01-15',
  dateModified: '2024-12-01',
  mainEntityOfPage: `${SITE_URL}/blog/goods-transport-guide`,
};

const VEHICLE_TYPES = [
  {
    icon: Bike,
    name: '2-Wheeler (Bike)',
    capacity: 'Up to 20 kg',
    bestFor: 'Documents, small parcels, medicines, food delivery',
    chargesPerKm: '₹10-15',
  },
  {
    icon: Car,
    name: '3-Wheeler (Auto)',
    capacity: 'Up to 300 kg',
    bestFor: 'Medium boxes, electronics, small furniture, bulk orders',
    chargesPerKm: '₹15-20',
  },
  {
    icon: Truck,
    name: 'Mini Truck (Tata Ace)',
    capacity: 'Up to 750 kg',
    bestFor: 'Large furniture, appliances, home shifting, bulk cargo',
    chargesPerKm: '₹18-25',
  },
  {
    icon: Truck,
    name: 'Tempo (Bolero/407)',
    capacity: 'Up to 1500 kg',
    bestFor: 'Commercial shipments, office shifting, heavy goods',
    chargesPerKm: '₹22-30',
  },
];

export default function GoodsTransportGuidePage() {
  const whatsappNumber = SUPPORT_PHONE || '918580584898';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi Liftngo, I need goods transport service.')}`;

  return (
    <ContentLayout
      breadcrumbs={[
        { name: 'Blog', path: '/blog' },
        { name: 'Goods Transport Guide', path: '/blog/goods-transport-guide' },
      ]}
    >
      <JsonLd data={articleSchema} />

      <article className="bg-white">
        {/* Hero */}
        <header className="bg-gradient-to-br from-indigo-600 to-purple-700 py-16 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <span className="mb-4 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-medium">
              GUIDE
            </span>
            <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              Complete Guide to Goods Transport Service in India
            </h1>
            <p className="mt-6 text-lg text-white/90">
              Everything you need to know about booking goods transport, choosing the right vehicle, 
              understanding charges, and ensuring safe delivery of your items.
            </p>
            <div className="mt-6 text-sm text-white/70">
              Updated: December 2024 • 10 min read
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Introduction */}
          <section className="prose prose-lg max-w-none">
            <h2>What is Goods Transport Service?</h2>
            <p>
              Goods transport service refers to the professional movement of cargo, parcels, and commercial 
              items from one location to another. Unlike passenger transport, goods transport focuses on 
              safe handling, timely delivery, and appropriate vehicle selection based on cargo size and weight.
            </p>
            <p>
              In India, goods transport services have evolved significantly with the rise of digital platforms 
              like Liftngo. Today, you can book a delivery vehicle instantly through an app or WhatsApp, 
              track your shipment in real-time, and pay digitally — all with transparent pricing.
            </p>

            <h2>Types of Goods Transport Vehicles</h2>
            <p>
              Choosing the right vehicle is crucial for cost-effective and safe delivery. Here&apos;s a breakdown 
              of common vehicle types used in goods transport:
            </p>
          </section>

          {/* Vehicle Types Grid */}
          <div className="my-8 grid gap-6 sm:grid-cols-2">
            {VEHICLE_TYPES.map((vehicle) => (
              <div
                key={vehicle.name}
                className="rounded-xl border border-gray-200 bg-gray-50 p-6"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <vehicle.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{vehicle.name}</h3>
                <ul className="mt-3 space-y-2 text-sm text-gray-600">
                  <li><strong>Capacity:</strong> {vehicle.capacity}</li>
                  <li><strong>Best for:</strong> {vehicle.bestFor}</li>
                  <li><strong>Charges:</strong> {vehicle.chargesPerKm}/km</li>
                </ul>
              </div>
            ))}
          </div>

          <section className="prose prose-lg max-w-none">
            <h2>How to Book Goods Transport Service</h2>
            <p>
              Booking goods transport has become incredibly simple with digital platforms. Here&apos;s the 
              step-by-step process:
            </p>
            <ol>
              <li>
                <strong>Enter Pickup &amp; Drop Location:</strong> Open the Liftngo app or website and enter 
                your pickup address and delivery destination. The system calculates distance automatically.
              </li>
              <li>
                <strong>Select Vehicle Type:</strong> Based on your cargo size and weight, choose from 
                2-wheeler, 3-wheeler, mini truck, or tempo options.
              </li>
              <li>
                <strong>See Upfront Pricing:</strong> Before confirming, you&apos;ll see the exact fare including 
                all charges. No hidden costs or surprises.
              </li>
              <li>
                <strong>Confirm Booking:</strong> Once satisfied with the quote, confirm your booking. 
                A driver is assigned within minutes.
              </li>
              <li>
                <strong>Track in Real-Time:</strong> Monitor your shipment&apos;s progress on the map. 
                Get notifications for pickup, in-transit, and delivery.
              </li>
            </ol>

            <h2>Understanding Delivery Charges Per KM</h2>
            <p>
              Goods transport charges in India typically depend on several factors:
            </p>
            <ul>
              <li><strong>Distance:</strong> The primary factor — longer distances mean higher charges</li>
              <li><strong>Vehicle Type:</strong> Larger vehicles cost more per km</li>
              <li><strong>Time of Day:</strong> Peak hours may have surge pricing</li>
              <li><strong>Loading/Unloading:</strong> Additional charges if helpers are needed</li>
              <li><strong>Waiting Time:</strong> Charges apply if driver waits beyond free time</li>
            </ul>
            <p>
              On average, delivery charges range from ₹10-30 per km depending on vehicle type. 
              Liftngo shows you the complete fare upfront, so you know exactly what you&apos;ll pay.
            </p>

            <h2>Same Day Delivery — How It Works</h2>
            <p>
              Same day delivery means your goods are picked up and delivered within the same calendar day. 
              This service is ideal for:
            </p>
            <ul>
              <li>Urgent business documents</li>
              <li>E-commerce orders requiring fast fulfillment</li>
              <li>Restaurant supplies and inventory</li>
              <li>Medical supplies and medicines</li>
              <li>Last-minute gifts and purchases</li>
            </ul>
            <p>
              For same day delivery, it&apos;s best to book before 2 PM for delivery by evening. 
              Express options are available for urgent shipments.
            </p>

            <h2>Tips for Safe Goods Transport</h2>
            <ol>
              <li>
                <strong>Pack Properly:</strong> Use appropriate packaging — bubble wrap for fragile items, 
                sturdy boxes for heavy goods, and waterproof covers for sensitive materials.
              </li>
              <li>
                <strong>Label Clearly:</strong> Mark packages with &quot;Fragile&quot;, &quot;This Side Up&quot;, or 
                handling instructions as needed.
              </li>
              <li>
                <strong>Declare Value:</strong> For expensive items, declare the value during booking 
                to ensure proper insurance coverage.
              </li>
              <li>
                <strong>Take Photos:</strong> Document the condition of goods before handover for 
                reference in case of disputes.
              </li>
              <li>
                <strong>Verify Delivery:</strong> Inspect items upon delivery and report any damage 
                immediately to the driver and support team.
              </li>
            </ol>

            <h2>Goods Transport for Businesses (B2B)</h2>
            <p>
              Businesses have unique logistics needs that go beyond one-time deliveries. Liftngo offers 
              specialized B2B services including:
            </p>
            <ul>
              <li><strong>Subscription Plans:</strong> Fixed number of deliveries per month at discounted rates</li>
              <li><strong>Dedicated Vehicles:</strong> Assign specific vehicles for your business routes</li>
              <li><strong>GST Invoicing:</strong> Proper tax documentation for all transactions</li>
              <li><strong>Multi-Stop Routes:</strong> Efficient routing for multiple delivery points</li>
              <li><strong>API Integration:</strong> Connect your systems directly with Liftngo</li>
            </ul>

            <h2>Frequently Asked Questions</h2>
            
            <h3>How much does goods transport cost?</h3>
            <p>
              Costs vary by vehicle and distance. Bike delivery starts at ₹10/km, auto at ₹15/km, 
              and mini trucks at ₹18/km. Use our fare calculator for exact quotes.
            </p>

            <h3>Is my shipment insured?</h3>
            <p>
              Yes, all Liftngo deliveries include basic transit insurance. For high-value items, 
              additional coverage is available.
            </p>

            <h3>Can I schedule a pickup for later?</h3>
            <p>
              Yes, you can schedule pickups up to 7 days in advance. This is useful for planned 
              shipments and recurring deliveries.
            </p>

            <h3>What items cannot be transported?</h3>
            <p>
              Prohibited items include hazardous materials, illegal goods, live animals, and 
              perishables without proper packaging. Check our terms for the complete list.
            </p>
          </section>

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-indigo-600 p-8 text-center text-white">
            <h2 className="text-2xl font-bold">Ready to Book Goods Transport?</h2>
            <p className="mt-2 text-indigo-100">
              Get instant quotes and book delivery in minutes
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-green-500 px-6 font-bold text-white hover:bg-green-600"
              >
                <MessageCircle className="h-5 w-5" />
                Book on WhatsApp
              </Link>
              <Link
                href="/fare-calculator"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 font-bold text-indigo-600 hover:bg-gray-100"
              >
                Calculate Fare
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Related Links */}
          <div className="mt-12">
            <h3 className="text-lg font-bold text-gray-900">Related Articles</h3>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/blog/home-shifting-tips"
                className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Home Shifting Tips
              </Link>
              <Link
                href="/blog/delivery-charges-guide"
                className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Delivery Charges Guide
              </Link>
              <Link
                href="/services/home-shifting"
                className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Home Shifting Service
              </Link>
              <Link
                href="/partner"
                className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Become a Partner
              </Link>
            </div>
          </div>
        </div>
      </article>
    </ContentLayout>
  );
}
