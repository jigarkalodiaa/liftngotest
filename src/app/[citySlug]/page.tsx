import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCityBySlug, getCityDescription } from '@/data/seoCities';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import JsonLd from '@/components/JsonLd';
import {
  ORGANIZATION_SCHEMA_ID,
  WEBSITE_SCHEMA_ID,
  buildPrimaryOrganizationNode,
} from '@/lib/structuredData/organizationShared';
import { Header, Hero, Features, FoodDelivery, Footer, PageWrapper } from '@/components/landing';

type Props = { params: Promise<{ citySlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { citySlug } = await params;
  const city = getCityBySlug(citySlug);
  if (!city) return { title: 'Not Found' };
  const description = getCityDescription(city.name, city.region);
  return generatePageMetadata({
    title: city.title,
    description,
    path: `/${city.slug}`,
    keywords: [
      `goods transport ${city.name}`,
      `mini truck booking ${city.name}`,
      `last mile delivery ${city.region}`,
      'liftngo',
    ],
  });
}

export async function generateStaticParams() {
  const { SEO_CITIES } = await import('@/data/seoCities');
  return SEO_CITIES.map((c) => ({ citySlug: c.slug }));
}

export default async function CityPage({ params }: Props) {
  const { citySlug } = await params;
  const city = getCityBySlug(citySlug);
  if (!city) notFound();

  const description = getCityDescription(city.name, city.region);

  const pageUrl = `${SITE_URL}/${city.slug}`;
  const citySeoGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      buildPrimaryOrganizationNode(),
      {
        '@type': 'WebSite',
        '@id': WEBSITE_SCHEMA_ID,
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        publisher: { '@id': ORGANIZATION_SCHEMA_ID },
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: city.title,
        description,
        inLanguage: 'en-IN',
        isPartOf: { '@id': WEBSITE_SCHEMA_ID },
        publisher: { '@id': ORGANIZATION_SCHEMA_ID },
      },
      {
        '@type': 'Place',
        name: `${city.name} - Goods Transport`,
        description,
        url: pageUrl,
      },
    ],
  };

  return (
    <PageWrapper>
      <JsonLd data={citySeoGraph} />
      <Header />
      <main>
        <section className="bg-[var(--landing-bg)] py-12 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Goods Transport & Last-Mile Delivery in {city.name}
            </h1>
            <p className="mt-4 text-lg text-gray-600">{description}</p>
          </div>
        </section>
        <section
          className="border-b border-gray-200/80 bg-white px-4 py-10 sm:py-12"
          aria-labelledby={`city-guide-${city.slug}`}
        >
          <div className="mx-auto max-w-3xl text-gray-700">
            <h2 id={`city-guide-${city.slug}`} className="text-xl font-semibold text-gray-900">
              How {SITE_NAME} serves {city.name} and {city.region}
            </h2>
            <p className="mt-4 leading-relaxed">
              {city.name} sits inside a commercial and commuter geography where{' '}
              <strong className="text-gray-900">small goods trips</strong> pile up faster than full-truck bookings. Retail counters, offices,
              and neighbourhood vendors need documents, cartons, and perishables moved on short notice—often with proof of handoff and without
              renting an entire tempo for twenty minutes of loading. {SITE_NAME} standardises that pattern: you enter pickup and drop, pick a
              vehicle class that matches payload (from walk and two-wheel slots up to three- and four-wheel cargo), and confirm an estimate before
              a partner accepts the job.
            </p>
            <p className="mt-4 leading-relaxed">
              Weekday peaks differ from festival weekends; in temple towns and dense corridors around {city.region}, traffic and parking shape
              which vehicle actually arrives on time. We bias toward honest ETAs and corridor-specific ops playbooks instead of promising
              nationwide parity. That matters for B2B lanes—if your wholesale restock misses a slot, the downstream retail shelf goes empty—
              and for food partners who cannot afford a cold chain fantasy on a ten-minute hop.
            </p>
            <p className="mt-4 leading-relaxed">
              Start with <Link href={ROUTES.BOOK_DELIVERY} className="font-semibold text-[var(--color-primary)] hover:underline">book delivery</Link>{' '}
              when you have pin-ready addresses; use{' '}
              <Link href={ROUTES.B2B_TRANSPORT} className="font-semibold text-[var(--color-primary)] hover:underline">B2B transport</Link>{' '}
              for recurring commercial context, or open the{' '}
              <Link href="/faq" className="font-semibold text-[var(--color-primary)] hover:underline">FAQ</Link>{' '}
              if you need vehicle guidance before you commit a pilot route in {city.name}.
            </p>
          </div>
        </section>
        <Hero heroTitleLevel="h2" />
        <Features />
        <FoodDelivery />
      </main>
      <Footer />
    </PageWrapper>
  );
}
