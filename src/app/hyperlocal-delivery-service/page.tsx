import { Metadata } from 'next';
import ContentLayout from '@/components/layout/ContentLayout';
import JsonLd from '@/components/JsonLd';
import { generatePageMetadata } from '@/lib/seo';
import { SUPPORT_PHONE } from '@/config/env';
import { StatsStrip, BenefitsGrid, HowItWorks, FaqSection, CoverageAreas } from '@/components/seo-pages';
import {
  HYPERLOCAL_SEO,
  HYPERLOCAL_SERVICE_JSON_LD,
  HYPERLOCAL_BREADCRUMB_JSON_LD,
  HYPERLOCAL_FAQ_JSON_LD,
  HYPERLOCAL_COVERAGE_AREAS,
  HYPERLOCAL_STATS,
  HYPERLOCAL_BENEFITS,
  HYPERLOCAL_HOW_IT_WORKS,
  HYPERLOCAL_FAQS,
} from '@/lib/constants/hyperlocalDelivery';
import HyperlocalHero from './HyperlocalHero';
import HyperlocalUseCases from './HyperlocalUseCases';
import HyperlocalProseContent from './HyperlocalProseContent';
import HyperlocalInternalLinks from './HyperlocalInternalLinks';
import HyperlocalCta from './HyperlocalCta';

export const metadata: Metadata = generatePageMetadata({
  title: HYPERLOCAL_SEO.title,
  description: HYPERLOCAL_SEO.description,
  path: HYPERLOCAL_SEO.path,
  keywords: HYPERLOCAL_SEO.keywords,
});

export default function HyperlocalDeliveryServicePage() {
  const whatsappNumber = SUPPORT_PHONE || '918580584898';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi%20Liftngo%2C%20I%20need%20hyperlocal%20delivery%20in%20Khatu`;

  return (
    <ContentLayout breadcrumbs={[{ name: 'Hyperlocal Delivery Service', path: HYPERLOCAL_SEO.path }]}>
      <JsonLd data={HYPERLOCAL_SERVICE_JSON_LD} />
      <JsonLd data={HYPERLOCAL_BREADCRUMB_JSON_LD} />
      <JsonLd data={HYPERLOCAL_FAQ_JSON_LD} />

      <HyperlocalHero whatsappLink={whatsappLink} />
      
      <StatsStrip stats={HYPERLOCAL_STATS} accentColor="text-purple-600" />
      
      <CoverageAreas
        title="Hyperlocal Coverage in Khatu"
        subtitle="Delivery times from Khatu Shyam Ji temple area"
        areas={HYPERLOCAL_COVERAGE_AREAS}
      />
      
      <HyperlocalProseContent />
      
      <HyperlocalUseCases />
      
      <BenefitsGrid
        title="Key Benefits"
        benefits={HYPERLOCAL_BENEFITS}
        columns={3}
        accentColor="bg-purple-100 text-purple-600"
      />
      
      <HowItWorks
        title="How Hyperlocal Delivery Works"
        steps={HYPERLOCAL_HOW_IT_WORKS}
        accentColor="bg-purple-600"
      />
      
      <FaqSection faqs={HYPERLOCAL_FAQS} />
      
      <HyperlocalInternalLinks />
      
      <HyperlocalCta whatsappLink={whatsappLink} whatsappNumber={whatsappNumber} />
    </ContentLayout>
  );
}
