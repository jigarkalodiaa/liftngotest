import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ContentLayout from '@/components/layout/ContentLayout';
import JsonLd from '@/components/JsonLd';
import { generatePageMetadata } from '@/lib/seo';
import { SUPPORT_PHONE } from '@/config/env';
import {
  getSeoPageData,
  getAllSeoPageSlugs,
  SeoPageTemplate,
  StickyCta,
  WhatsAppTrigger,
  PageAnalytics,
} from '@/features/seo-pages';

interface PageProps {
  params: { slug: string };
}

/**
 * ISR: Revalidate every 24 hours (86400 seconds)
 * Pages are statically generated and revalidated periodically
 */
export const revalidate = 86400;

/**
 * Generate static params for all SEO pages
 * This enables static generation at build time
 */
export async function generateStaticParams() {
  const slugs = getAllSeoPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * Generate metadata for each SEO page (server-side)
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = getSeoPageData(params.slug);
  
  if (!data) {
    return {
      title: 'Page Not Found',
    };
  }
  
  return generatePageMetadata({
    title: data.seo.title,
    description: data.seo.description,
    path: data.seo.path,
    keywords: data.seo.keywords,
  });
}

/**
 * Dynamic SEO page component
 * Fully server-rendered with client-side conversion components
 */
export default function DynamicSeoPage({ params }: PageProps) {
  const data = getSeoPageData(params.slug);
  
  if (!data) {
    notFound();
  }

  const whatsappNumber = SUPPORT_PHONE || '918580584898';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(data.cta.whatsappText)}`;
  
  return (
    <ContentLayout breadcrumbs={[{ name: data.hero.title, path: data.seo.path }]}>
      {/* Structured Data (SSR) */}
      <JsonLd data={data.schema.service} />
      <JsonLd data={data.schema.breadcrumb} />
      <JsonLd data={data.schema.faq} />
      
      {/* Page Content (Server Components) */}
      <SeoPageTemplate data={data} />

      {/* Conversion Components (Client) */}
      <StickyCta
        whatsappLink={whatsappLink}
        message="Book Now"
        pageSlug={data.slug}
        showAfterScroll={400}
      />
      
      <WhatsAppTrigger
        whatsappLink={whatsappLink}
        pageSlug={data.slug}
        showAfterSeconds={5}
      />

      {/* Analytics (Client) */}
      <PageAnalytics
        pageSlug={data.slug}
        pageTitle={data.seo.title}
      />
    </ContentLayout>
  );
}
