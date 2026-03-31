import Image from '@/components/OptimizedImage';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME } from '@/lib/site';
import ContentLayout from '@/components/layout/ContentLayout';
import {
  indiaPhotoBangaloreAutos,
  indiaPhotoBangaloreLoadedTruck,
  indiaPhotoHosurMotorcycle,
  indiaPhotoHyderabadAuto,
  indiaPhotoMumbaiLoading,
  indiaPhotoMumbaiStreetWalk,
} from '@/config/indiaLogisticsImages';

export const metadata = generatePageMetadata({
  title: `Terms & Conditions | ${SITE_NAME}`,
  description: `Terms of service for using ${SITE_NAME} logistics and delivery platform. User agreement, booking terms, and acceptable use.`,
  path: '/terms',
  keywords: ['LiftnGo terms', 'terms of service', 'user agreement', 'delivery terms'],
});

const SECTIONS = [
  {
    title: 'Acceptance of terms',
    content: `By accessing or using the ${SITE_NAME} platform, website, or mobile applications, you agree to be bound by these Terms of Service. If you do not agree, do not use our services. We may update these terms from time to time; continued use after changes constitutes acceptance.`,
    image: indiaPhotoBangaloreLoadedTruck(600),
    alt: 'Goods truck in Bengaluru — using Liftngo services in India',
  },
  {
    title: 'Description of services',
    content: `${SITE_NAME} provides a technology platform that connects customers with driver partners for goods transportation and last-mile delivery. We do not provide transport ourselves; we facilitate bookings between users and drivers. Availability and pricing may vary by location and service type.`,
    image: indiaPhotoBangaloreAutos(600),
    alt: 'Warehouse and distribution operations — goods logistics and last-mile network',
  },
  {
    title: 'User accounts and eligibility',
    content:
      'You must be at least 18 years old and able to enter into a binding contract to use our services. You are responsible for maintaining the confidentiality of your account and for all activity under your account. You must provide accurate and complete information when registering or booking.',
    image: indiaPhotoHosurMotorcycle(600),
    alt: 'Delivery professional with goods equipment — customer accounts and logistics partners',
  },
  {
    title: 'Bookings and payments',
    content:
      'When you book a delivery, you agree to pay the fare and any applicable fees displayed at the time of booking. Payment may be collected in advance or after completion as per the chosen method. Cancellation and refund policies are disclosed at booking and in the app. We may use third-party payment processors; their terms may also apply.',
    image: indiaPhotoMumbaiLoading(600),
    alt: 'Workers loading a truck in Mumbai — bookings and commercial goods',
  },
  {
    title: 'Prohibited use',
    content:
      "You may not use our platform for any illegal purpose, to transport prohibited or hazardous goods, or to harm others. You may not abuse, circumvent, or attempt to gain unauthorized access to our systems or other users' accounts. We reserve the right to suspend or terminate accounts that violate these terms.",
    image: indiaPhotoHyderabadAuto(600),
    alt: 'Cargo loading bay with packages — compliant goods transport only',
  },
  {
    title: 'Driver partners',
    content:
      'Driver partners are independent; they are not employees of LiftnGo. We do not guarantee the availability, conduct, or quality of any driver. Disputes regarding a delivery may be raised through our support channels; we will endeavour to assist in resolution in line with our policies.',
    image: indiaPhotoHosurMotorcycle(600),
    alt: 'Goods delivery partner — independent driver partners for cargo',
  },
  {
    title: 'Disclaimer of warranties',
    content:
      'Our services are provided as is and as available. We do not warrant that the platform will be uninterrupted, error-free, or free of harmful components. To the fullest extent permitted by law, we disclaim all warranties, express or implied.',
    image: indiaPhotoMumbaiStreetWalk(600),
    alt: 'Retail goods and market logistics — services as available in covered areas',
  },
  {
    title: 'Limitation of liability',
    content:
      'To the maximum extent permitted by applicable law, LiftnGo and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or for loss of profits, data, or use. Our total liability for any claim arising from your use of the services shall not exceed the amount you paid to us in the twelve months preceding the claim.',
    image: indiaPhotoBangaloreLoadedTruck(600),
    alt: 'Urban goods transport in India — liability limits',
  },
  {
    title: 'Governing law',
    content:
      'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of India, unless otherwise required by applicable law.',
    image: indiaPhotoBangaloreAutos(600),
    alt: 'Commercial goods transport — governed by laws of India',
  },
  {
    title: 'Contact',
    content: `For questions about these terms, contact us at legal@liftngo.com or through the contact options on our website.`,
    image: indiaPhotoMumbaiStreetWalk(600),
    alt: 'Goods logistics operations — contact Liftngo',
  },
];

export default function TermsPage() {
  return (
    <ContentLayout>
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gray-900">
          <div className="absolute inset-0">
            <Image
              src={indiaPhotoBangaloreLoadedTruck(1600)}
              alt="Indian urban logistics — terms and conditions"
              fill
              className="object-cover opacity-60"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent" />
          </div>
          <div className="relative mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 sm:py-20 lg:px-8">
            <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">Terms & Conditions</h1>
            <p className="text-gray-200">
              Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          {SECTIONS.map((section) => (
            <section key={section.title} className="mb-12 border-b border-gray-100 pb-12 last:mb-0 last:border-0 last:pb-0">
              <div className="relative mb-4 aspect-[2/1] w-full overflow-hidden rounded-xl bg-gray-100 sm:aspect-[21/9]">
                <Image src={section.image} alt={section.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 672px" />
              </div>
              <h2 className="mb-3 text-xl font-semibold text-gray-900">{section.title}</h2>
              <p className="leading-relaxed text-gray-600">{section.content}</p>
            </section>
          ))}
        </div>
      </main>
    </ContentLayout>
  );
}
