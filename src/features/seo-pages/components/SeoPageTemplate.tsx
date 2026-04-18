import { SeoPageData } from '../types';
import { SUPPORT_PHONE } from '@/config/env';
import { SeoHero } from './SeoHero';
import { SeoStats } from './SeoStats';
import { SeoCoverage } from './SeoCoverage';
import { SeoProse } from './SeoProse';
import { SeoUseCases } from './SeoUseCases';
import { SeoBenefits } from './SeoBenefits';
import { SeoHowItWorks } from './SeoHowItWorks';
import { SeoFaqs } from './SeoFaqs';
import { SeoInternalLinks } from './SeoInternalLinks';
import { SeoCta } from './SeoCta';

interface SeoPageTemplateProps {
  data: SeoPageData;
}

/**
 * Server-rendered SEO page template
 * Composes all section components for full SSR
 */
export function SeoPageTemplate({ data }: SeoPageTemplateProps) {
  const whatsappNumber = SUPPORT_PHONE || '918580584898';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(data.cta.whatsappText)}`;

  return (
    <>
      <SeoHero
        hero={data.hero}
        gradient={data.theme.gradient}
        whatsappLink={whatsappLink}
      />

      <SeoStats
        stats={data.stats}
        accentColor={`text-${data.theme.accent}`}
      />

      {data.coverageAreas && (
        <SeoCoverage
          areas={data.coverageAreas}
          city={data.city}
          primaryColor={data.theme.primary}
        />
      )}

      {data.prose && (
        <SeoProse sections={data.prose} />
      )}

      {data.useCases && (
        <SeoUseCases
          useCases={data.useCases}
          primaryColor={data.theme.primary}
        />
      )}

      <SeoBenefits
        benefits={data.benefits}
        primaryColor={data.theme.primary}
      />

      <SeoHowItWorks
        steps={data.howItWorks}
        accentColor={`bg-${data.theme.accent}`}
      />

      <SeoFaqs faqs={data.faqs} />

      <SeoInternalLinks links={data.internalLinks} />

      <SeoCta
        cta={data.cta}
        whatsappLink={whatsappLink}
        phoneNumber={whatsappNumber}
      />
    </>
  );
}
