import { Metadata } from 'next';
import Link from 'next/link';
import {
  Truck,
  Building2,
  Clock,
  MapPin,
  Phone,
  CheckCircle,
  ArrowRight,
  Eye,
  IndianRupee,
  MessageCircle,
  Target,
  TrendingUp,
  Palette,
} from 'lucide-react';
import ContentLayout from '@/components/layout/ContentLayout';
import JsonLd from '@/components/JsonLd';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_URL, SITE_NAME } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import { SUPPORT_PHONE } from '@/config/env';

const PATH = '/fleet-branding-rajasthan';
const PAGE_URL = `${SITE_URL}${PATH}`;

export const metadata: Metadata = generatePageMetadata({
  title: 'Fleet Branding Rajasthan — Vehicle Advertising',
  description:
    'Fleet branding and vehicle wrapping in Rajasthan. Advertise on delivery vehicles across Khatu, Sikar, and Jaipur. Moving billboards from ₹2,000/month.',
  path: PATH,
  keywords: [
    'fleet branding Rajasthan',
    'vehicle advertising Rajasthan',
    'vehicle wrap Rajasthan',
    'mobile billboard Rajasthan',
    'delivery vehicle branding',
    'truck advertising Khatu',
    'auto branding Sikar',
    'fleet wrap India',
    'vehicle graphics Rajasthan',
    'transit advertising',
  ],
});

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${PAGE_URL}/#service`,
  name: 'Fleet Branding Rajasthan — Liftngo',
  url: PAGE_URL,
  description:
    'Fleet branding and vehicle wrapping services across Rajasthan. Transform delivery vehicles into moving billboards for your brand.',
  serviceType: 'Vehicle Advertising',
  areaServed: [
    { '@type': 'State', name: 'Rajasthan' },
    { '@type': 'Place', name: 'Khatu Shyam Ji' },
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
    lowPrice: '2000',
    highPrice: '15000',
    offerCount: '4',
    availability: 'https://schema.org/InStock',
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Fleet Branding Rajasthan', item: PAGE_URL },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does fleet branding cost in Rajasthan?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Fleet branding in Rajasthan starts from ₹2,000 per month for 2-wheeler branding. 3-wheeler (auto) branding costs ₹4,000-8,000/month, and 4-wheeler (mini truck) branding ranges from ₹8,000-15,000/month.',
      },
    },
    {
      '@type': 'Question',
      name: 'What areas in Rajasthan do your branded vehicles cover?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our branded fleet operates primarily in Khatu Shyam Ji, Sikar district, and surrounding areas. We are expanding to Jaipur and other major cities in Rajasthan.',
      },
    },
    {
      '@type': 'Question',
      name: 'How many impressions can I expect from fleet branding?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Each branded vehicle generates 30,000-50,000 impressions per month depending on route and vehicle type. In high-traffic areas like Khatu temple, impressions can be even higher.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you handle the design and printing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, we provide end-to-end service including design, printing, and installation. You can also provide your own designs if you prefer.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the minimum campaign duration?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Minimum campaign duration is 1 month. We offer discounts for 3-month, 6-month, and annual commitments.',
      },
    },
  ],
};

const VEHICLE_OPTIONS = [
  {
    type: '2-Wheeler',
    description: 'Bikes and scooters for hyperlocal visibility',
    price: '₹2,000 - ₹3,000/month',
    impressions: '20,000-30,000/month',
    bestFor: 'Local shops, restaurants, small businesses',
  },
  {
    type: '3-Wheeler (Auto)',
    description: 'Cargo autos and EV rickshaws',
    price: '₹4,000 - ₹8,000/month',
    impressions: '30,000-50,000/month',
    bestFor: 'Mid-size businesses, regional brands',
  },
  {
    type: '4-Wheeler (Mini Truck)',
    description: 'Tata Ace, Mahindra Bolero cargo',
    price: '₹8,000 - ₹15,000/month',
    impressions: '50,000-80,000/month',
    bestFor: 'Large brands, maximum visibility',
  },
];

const BENEFITS = [
  {
    icon: Eye,
    title: '50,000+ Monthly Impressions',
    description: 'Each vehicle is seen by thousands daily on busy routes and temple areas.',
  },
  {
    icon: Target,
    title: 'Targeted Local Reach',
    description: 'Reach pilgrims, tourists, and locals in Khatu Shyam Ji and Sikar.',
  },
  {
    icon: IndianRupee,
    title: 'Cost-Effective',
    description: 'Lower CPM than billboards or digital ads. Pay per vehicle, not per impression.',
  },
  {
    icon: TrendingUp,
    title: 'Always Moving',
    description: 'Unlike static billboards, your ad moves through different areas daily.',
  },
  {
    icon: Palette,
    title: 'Full Creative Control',
    description: 'Design your own wrap or use our design team. Full vehicle or partial branding.',
  },
  {
    icon: Clock,
    title: 'Quick Turnaround',
    description: 'From design approval to on-road in 7-10 days.',
  },
];

const HOW_IT_WORKS = [
  {
    step: 1,
    title: 'Choose Your Fleet',
    description: 'Select vehicle type and quantity based on your budget and reach goals.',
  },
  {
    step: 2,
    title: 'Design & Approve',
    description: 'Our team creates designs or you provide your own. Review and approve.',
  },
  {
    step: 3,
    title: 'Print & Install',
    description: 'High-quality vinyl printing and professional installation on vehicles.',
  },
  {
    step: 4,
    title: 'Go Live & Track',
    description: 'Your branded vehicles hit the road. Get monthly reports on routes covered.',
  },
];

const FAQS = [
  {
    question: 'How much does fleet branding cost in Rajasthan?',
    answer: 'Fleet branding in Rajasthan starts from ₹2,000 per month for 2-wheeler branding. 3-wheeler (auto) branding costs ₹4,000-8,000/month depending on coverage area. 4-wheeler (mini truck) branding ranges from ₹8,000-15,000/month for full wrap.',
  },
  {
    question: 'What areas in Rajasthan do your branded vehicles cover?',
    answer: 'Our branded fleet operates primarily in Khatu Shyam Ji, Sikar district, Reengus, and surrounding areas. We are expanding to Jaipur, Bikaner, and other major cities. Routes include temple corridors, markets, and commercial areas.',
  },
  {
    question: 'How many impressions can I expect from fleet branding?',
    answer: 'Each branded vehicle generates 30,000-50,000 impressions per month depending on route and vehicle type. In high-traffic areas like Khatu temple during festivals, impressions can exceed 100,000/month.',
  },
  {
    question: 'Do you handle the design and printing?',
    answer: 'Yes, we provide end-to-end service including design, printing, and installation. Our design team can create eye-catching wraps based on your brand guidelines. You can also provide your own print-ready designs.',
  },
  {
    question: 'What is the minimum campaign duration?',
    answer: 'Minimum campaign duration is 1 month. We offer 10% discount for 3-month commitments, 15% for 6-month, and 20% for annual campaigns. Longer commitments also get priority vehicle allocation.',
  },
];

export default function FleetBrandingRajasthanPage() {
  const whatsappNumber = SUPPORT_PHONE || '918580584898';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi%20Liftngo%2C%20I%20want%20to%20know%20about%20fleet%20branding%20in%20Rajasthan`;

  return (
    <ContentLayout breadcrumbs={[{ name: 'Fleet Branding Rajasthan', path: PATH }]}>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2C2D5B] to-[#1a1b3a] text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-4 py-2 text-sm font-bold text-orange-300">
              <Truck className="h-4 w-4" />
              MOBILE ADVERTISING
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Fleet Branding & Vehicle Wrapping in Rajasthan
            </h1>
            <p className="mt-6 text-lg text-white/80 sm:text-xl">
              Transform delivery vehicles into moving billboards. Reach thousands of pilgrims 
              and locals in Khatu, Sikar, and across Rajasthan. Starting at 
              <strong className="text-orange-400"> ₹2,000/month</strong>.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center gap-3 rounded-full bg-orange-500 px-8 text-lg font-bold text-white shadow-lg transition-all hover:bg-orange-600"
              >
                <MessageCircle className="h-5 w-5" />
                Get Quote on WhatsApp
              </Link>
              <Link
                href={ROUTES.FLEET_BRANDING}
                className="inline-flex h-14 items-center gap-2 rounded-full border-2 border-white/30 px-8 text-lg font-semibold text-white transition-all hover:bg-white/10"
              >
                View Pricing Calculator
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-4 sm:gap-8">
          <div className="text-center">
            <div className="text-3xl font-black text-[#2C2D5B] sm:text-4xl">100+</div>
            <div className="text-sm text-gray-600">Vehicles Available</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-[#2C2D5B] sm:text-4xl">50K+</div>
            <div className="text-sm text-gray-600">Monthly Impressions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-[#2C2D5B] sm:text-4xl">₹2K</div>
            <div className="text-sm text-gray-600">Starting Price</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-[#2C2D5B] sm:text-4xl">7</div>
            <div className="text-sm text-gray-600">Days to Go Live</div>
          </div>
        </div>
      </section>

      {/* Vehicle Options */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Choose Your Fleet Type
            </h2>
            <p className="mt-4 text-gray-600">
              Multiple vehicle options to match your budget and reach goals
            </p>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {VEHICLE_OPTIONS.map((option) => (
              <div
                key={option.type}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
              >
                <h3 className="text-xl font-bold text-gray-900">{option.type}</h3>
                <p className="mt-2 text-gray-600">{option.description}</p>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Price</span>
                    <span className="font-bold text-[#2C2D5B]">{option.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Impressions</span>
                    <span className="font-semibold text-gray-700">{option.impressions}</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3">
                    <span className="text-sm text-gray-500">Best for:</span>
                    <p className="mt-1 text-sm font-medium text-gray-700">{option.bestFor}</p>
                  </div>
                </div>
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
              Why Fleet Branding Works in Rajasthan
            </h2>
            <p>
              Rajasthan sees millions of pilgrims and tourists every year, especially around 
              religious destinations like Khatu Shyam Ji. Traditional advertising — billboards, 
              newspaper ads, radio — reaches a fraction of this audience at high costs.
            </p>
            <p>
              <strong>Fleet branding</strong> puts your brand on vehicles that move through 
              the busiest areas daily. A single branded auto near Khatu temple is seen by 
              thousands of devotees every day. Over a month, that&apos;s 30,000-50,000 impressions 
              for a fraction of billboard costs.
            </p>
            <p>
              Our delivery fleet operates across Khatu, Sikar, Reengus, and surrounding areas. 
              These vehicles make multiple trips daily, covering markets, residential areas, 
              hotels, and temple corridors. Your brand travels with them.
            </p>

            <h3 className="text-xl font-bold text-gray-900">
              Who Should Consider Fleet Branding?
            </h3>
            <ul>
              <li><strong>Local Businesses:</strong> Shops, restaurants, hotels wanting local visibility</li>
              <li><strong>Regional Brands:</strong> FMCG, consumer goods targeting Rajasthan market</li>
              <li><strong>Real Estate:</strong> Property developers with projects in Sikar/Khatu area</li>
              <li><strong>Healthcare:</strong> Hospitals, clinics, pharmacies building local awareness</li>
              <li><strong>Education:</strong> Schools, coaching centers reaching parents and students</li>
              <li><strong>Events:</strong> Melas, exhibitions, religious events needing quick promotion</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900">
              Full-Service Fleet Branding
            </h3>
            <p>
              We handle everything from design to installation:
            </p>
            <ul>
              <li><strong>Design:</strong> Our team creates eye-catching vehicle wraps</li>
              <li><strong>Printing:</strong> High-quality vinyl that lasts 12+ months</li>
              <li><strong>Installation:</strong> Professional fitting on selected vehicles</li>
              <li><strong>Tracking:</strong> Monthly reports on routes and areas covered</li>
              <li><strong>Maintenance:</strong> Replacement if wrap gets damaged</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Key Benefits of Fleet Branding
            </h2>
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
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              How Fleet Branding Works
            </h2>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
              href={ROUTES.FLEET_BRANDING}
              className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-200"
            >
              <Building2 className="h-4 w-4" />
              Fleet Branding Calculator
            </Link>
            <Link
              href="/b2b-logistics-rajasthan"
              className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-200"
            >
              <Truck className="h-4 w-4" />
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
              href={ROUTES.CONTACT}
              className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-200"
            >
              <Phone className="h-4 w-4" />
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#2C2D5B]">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to Put Your Brand on the Road?
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Get a custom quote for your fleet branding campaign. 
            Our team will help you choose the right vehicles and coverage.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center gap-3 rounded-full bg-orange-500 px-8 text-lg font-bold text-white shadow-lg transition-all hover:bg-orange-600"
            >
              <MessageCircle className="h-5 w-5" />
              Get Quote on WhatsApp
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
            WhatsApp: +91 85805 84898 • Free consultation
          </p>
        </div>
      </section>
    </ContentLayout>
  );
}
