import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCityBySlug, getCityDescription } from '@/data/seoCities';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from '@/lib/site';
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
        <Hero />
        <Features />
        <FoodDelivery />
      </main>
      <Footer />
    </PageWrapper>
  );
}
