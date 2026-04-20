import { Metadata } from 'next';
import Link from 'next/link';
import {
  Smartphone,
  IndianRupee,
  Clock,
  Shield,
  MapPin,
  Users,
  Truck,
  Bike,
  CheckCircle,
  ArrowRight,
  Phone,
  MessageCircle,
  Star,
  Wallet,
  Calendar,
  Headphones,
} from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_URL, SITE_NAME } from '@/lib/site';
import { SUPPORT_PHONE } from '@/config/env';
import ContentLayout from '@/components/layout/ContentLayout';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = generatePageMetadata({
  title: 'Become a Delivery Partner | Driver Jobs — Liftngo',
  description:
    'Join Liftngo as a delivery partner in Noida & Delhi NCR. Earn daily with flexible hours. Bike, auto, or mini truck — attach your vehicle and start earning. Download driver app now.',
  path: '/partner',
  keywords: [
    'delivery partner',
    'driver partner app',
    'delivery driver jobs',
    'logistics partner',
    'transport partner',
    'earn with delivery',
    'delivery jobs near me',
    'driver jobs noida',
    'cargo driver jobs',
    'mini truck driver jobs',
    'tempo driver jobs',
    'bike delivery jobs',
    'part time delivery jobs',
    'full time driver jobs',
    'fleet owner partnership',
    'attach vehicle for delivery',
  ],
});

const jobPostingSchema = {
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title: 'Delivery Partner / Driver',
  description:
    'Join Liftngo as a delivery partner. Use your own vehicle (bike, auto, or mini truck) to deliver goods and earn daily. Flexible hours, weekly payouts, and full support.',
  datePosted: '2024-01-01',
  validThrough: '2025-12-31',
  employmentType: ['FULL_TIME', 'PART_TIME', 'CONTRACTOR'],
  hiringOrganization: {
    '@type': 'Organization',
    name: SITE_NAME,
    sameAs: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
  },
  jobLocation: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Noida',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
  },
  baseSalary: {
    '@type': 'MonetaryAmount',
    currency: 'INR',
    value: {
      '@type': 'QuantitativeValue',
      minValue: 15000,
      maxValue: 50000,
      unitText: 'MONTH',
    },
  },
  responsibilities:
    'Pick up and deliver goods safely. Maintain vehicle in good condition. Use Liftngo driver app for navigation and updates. Provide excellent customer service.',
  qualifications:
    'Valid driving license. Own vehicle (bike, auto, or mini truck). Smartphone with internet. Basic knowledge of local areas.',
  skills: 'Driving, Navigation, Customer Service, Time Management',
  industry: 'Logistics and Transportation',
};

const BENEFITS = [
  {
    icon: IndianRupee,
    title: 'Earn ₹15,000 - ₹50,000/month',
    description: 'Earnings depend on trips completed. Top partners earn ₹50K+ monthly.',
  },
  {
    icon: Wallet,
    title: 'Weekly Payouts',
    description: 'Get paid every week directly to your bank account. No delays.',
  },
  {
    icon: Clock,
    title: 'Flexible Hours',
    description: 'Work when you want. Full-time, part-time, or just weekends.',
  },
  {
    icon: Smartphone,
    title: 'Easy Driver App',
    description: 'Simple app with navigation, earnings tracker, and instant support.',
  },
  {
    icon: Shield,
    title: 'Insurance Coverage',
    description: 'Accident insurance for all active delivery partners.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Dedicated partner support team available round the clock.',
  },
];

const VEHICLE_TYPES = [
  {
    icon: Bike,
    title: 'Bike Partners',
    earnings: '₹15,000 - ₹25,000/month',
    requirements: ['Two-wheeler with valid RC', 'Driving license', 'Smartphone'],
  },
  {
    icon: Truck,
    title: 'Auto/3W Partners',
    earnings: '₹20,000 - ₹35,000/month',
    requirements: ['Commercial auto/3-wheeler', 'Commercial license', 'Smartphone'],
  },
  {
    icon: Truck,
    title: 'Mini Truck Partners',
    earnings: '₹30,000 - ₹50,000/month',
    requirements: ['Tata Ace or similar', 'LMV/HMV license', 'Smartphone'],
  },
];

const STEPS = [
  {
    step: 1,
    title: 'Register Online',
    description: 'Fill the form or WhatsApp us with your details and vehicle info.',
  },
  {
    step: 2,
    title: 'Document Verification',
    description: 'Submit DL, RC, Aadhaar, and PAN. Verification takes 24-48 hours.',
  },
  {
    step: 3,
    title: 'Download App',
    description: 'Install Liftngo Driver app and complete your profile setup.',
  },
  {
    step: 4,
    title: 'Start Earning',
    description: 'Go online, accept trips, and start earning from day one.',
  },
];

const FAQS = [
  {
    question: 'How much can I earn as a delivery partner?',
    answer:
      'Earnings depend on vehicle type and hours worked. Bike partners earn ₹15,000-25,000/month, auto partners earn ₹20,000-35,000/month, and mini truck partners earn ₹30,000-50,000/month. Top performers earn even more with incentives.',
  },
  {
    question: 'What documents are required to join?',
    answer:
      'You need: Valid driving license, Vehicle RC (Registration Certificate), Aadhaar card, PAN card, Bank account details, and a passport-size photo. For commercial vehicles, commercial license and permit are required.',
  },
  {
    question: 'Can I work part-time?',
    answer:
      'Yes, Liftngo offers complete flexibility. You can work full-time, part-time, or just on weekends. There are no minimum hour requirements. Work when it suits you.',
  },
  {
    question: 'How do I get paid?',
    answer:
      'Payments are made weekly directly to your bank account. You can track your earnings in real-time on the driver app. Cash collected from COD orders is settled in weekly payouts.',
  },
  {
    question: 'Is there any joining fee?',
    answer:
      'No, there is absolutely no joining fee or registration charge. Liftngo partner program is completely free to join. You only need your own vehicle and valid documents.',
  },
  {
    question: 'What areas can I work in?',
    answer:
      'Currently, we operate in Noida, Greater Noida, Delhi, Gurgaon, Ghaziabad, and Faridabad. You can choose your preferred working area and get trips accordingly.',
  },
];

export default function PartnerPage() {
  const whatsappNumber = SUPPORT_PHONE || '918580584898';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi Liftngo, I want to join as a delivery partner. Please share details.')}`;

  return (
    <ContentLayout breadcrumbs={[{ name: 'Become a Partner', path: '/partner' }]}>
      <JsonLd data={jobPostingSchema} />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold">
              <Users className="h-4 w-4" />
              DELIVERY PARTNER PROGRAM
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Join Liftngo as a Delivery Partner
            </h1>
            <p className="mt-6 text-lg text-white/90 sm:text-xl">
              Use your bike, auto, or mini truck to earn ₹15,000 - ₹50,000 per month. 
              Flexible hours, weekly payouts, and full support. No joining fee.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center gap-3 rounded-full bg-white px-8 text-lg font-bold text-green-700 shadow-lg transition-all hover:bg-gray-50"
              >
                <MessageCircle className="h-5 w-5" />
                Join via WhatsApp
              </Link>
              <a
                href={`tel:+${whatsappNumber}`}
                className="inline-flex h-14 items-center gap-2 rounded-full border-2 border-white px-8 text-lg font-semibold text-white transition-all hover:bg-white/10"
              >
                <Phone className="h-5 w-5" />
                Call to Register
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
              <div className="text-3xl font-black text-green-600 sm:text-4xl">5000+</div>
              <div className="text-sm text-gray-600">Active Partners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-green-600 sm:text-4xl">₹50K</div>
              <div className="text-sm text-gray-600">Top Monthly Earning</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-green-600 sm:text-4xl">Weekly</div>
              <div className="text-sm text-gray-600">Payouts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-green-600 sm:text-4xl">₹0</div>
              <div className="text-sm text-gray-600">Joining Fee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Download the Driver App — Partner Benefits
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
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

      {/* Vehicle Types */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Jobs in Transport &amp; Delivery — Choose Your Vehicle
          </h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {VEHICLE_TYPES.map((vehicle) => (
              <div
                key={vehicle.title}
                className="rounded-2xl border-2 border-green-100 bg-green-50/50 p-6"
              >
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-green-600 text-white">
                  <vehicle.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{vehicle.title}</h3>
                <p className="mt-2 text-2xl font-bold text-green-600">{vehicle.earnings}</p>
                <ul className="mt-4 space-y-2">
                  {vehicle.requirements.map((req) => (
                    <li key={req} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Join */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            How to Become a Delivery Partner
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {STEPS.map((step, index) => (
              <div key={step.step} className="relative text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-gray-600">{step.description}</p>
                {index < STEPS.length - 1 && (
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
            Delivery Jobs Near Me — Work in These Areas
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
              'Dwarka',
              'Rohini',
              'Saket',
            ].map((area) => (
              <span
                key={area}
                className="inline-flex items-center gap-1 rounded-full bg-green-50 px-4 py-2 text-sm font-medium text-green-700"
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
      <section className="bg-green-600 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Start Earning Today — Join Liftngo Partner Network
          </h2>
          <p className="mt-4 text-lg text-white/90">
            No joining fee. Flexible hours. Weekly payouts. 24/7 support.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center gap-3 rounded-full bg-white px-8 text-lg font-bold text-green-700 shadow-lg transition-all hover:bg-gray-50"
            >
              <MessageCircle className="h-5 w-5" />
              Register on WhatsApp
            </Link>
            <a
              href={`tel:+${whatsappNumber}`}
              className="inline-flex h-14 items-center gap-2 rounded-full border-2 border-white px-8 text-lg font-semibold text-white transition-all hover:bg-white/10"
            >
              <Phone className="h-5 w-5" />
              Call Now
            </a>
          </div>
        </div>
      </section>
    </ContentLayout>
  );
}
