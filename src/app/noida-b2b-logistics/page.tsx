import ContentLayout from '@/components/layout/ContentLayout';
import JsonLd from '@/components/JsonLd';
import dynamic from 'next/dynamic';
import MarketingPageShell from '@/components/marketing/MarketingPageShell';
import TrustBadge from '@/components/sales-funnel/TrustBadge';
import { NoidaB2bProductHeroActions } from './NoidaB2bProductClient';
import { generatePageMetadata } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';
import { ROUTES } from '@/lib/constants';
import { buildNoidaB2bLogisticsGraph } from '@/lib/structuredData/locationPages';
import { NOIDA_B2B_LANDING_FAQ } from '@/data/noidaB2bLandingFaq';
import { BREADCRUMB_HOME } from '@/lib/breadcrumbsNav';
import { BadgeCheck, LayoutDashboard, ShieldCheck, Truck, Zap } from 'lucide-react';

const NoidaB2bProductClient = dynamic(
  () => import('./NoidaB2bProductClient').then((m) => ({ default: m.NoidaB2bProductMirrorBody })),
  {
    loading: () => (
      <div className="mx-auto max-w-4xl space-y-6 py-8">
        <div className="h-36 animate-pulse rounded-2xl bg-gray-200/70" />
        <div className="h-48 animate-pulse rounded-2xl bg-gray-200/50" />
        <div className="h-56 animate-pulse rounded-2xl bg-gray-200/40" />
      </div>
    ),
  },
);

const PATH = '/noida-b2b-logistics';
const PAGE_URL = `${SITE_URL}${PATH}`;
const TITLE = 'Liftngo for business in Noida | Subscriptions, lease & on-demand goods';
const DESCRIPTION =
  'Subscription trip packs, vehicle lease, driver bookings, and self-drive rent for Noida—verified partners, GST-ready invoicing, same flows as the Noida dashboard.';

const HERO_LEAD =
  'Pick subscription, lease, rent, or on-demand delivery (2W–4W). Everything below mirrors what you already get on the Noida dashboard—fast paths to book, choose plans, or talk to us.';

const PAGE_KEYWORDS = [
  'Liftngo Noida',
  'B2B logistics Noida',
  'goods subscription Noida',
  'three wheeler delivery Noida GST',
  'vehicle lease Noida business',
  'cargo booking Noida',
] as const;

export const metadata = generatePageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: [...PAGE_KEYWORDS],
});

const faqForSchema = [...NOIDA_B2B_LANDING_FAQ].map((x) => ({
  question: x.question,
  answer: x.answer,
}));

export default function NoidaB2bLogisticsPage() {
  return (
    <ContentLayout
      breadcrumbNavVisible={false}
      breadcrumbs={[BREADCRUMB_HOME, { name: 'Noida B2B logistics', path: PATH }]}
    >
      <JsonLd
        data={buildNoidaB2bLogisticsGraph({
          pageUrl: PAGE_URL,
          title: TITLE,
          description: DESCRIPTION,
          faq: faqForSchema,
          keywords: [...PAGE_KEYWORDS],
          breadcrumb: [
            { name: 'Home', url: `${SITE_URL}/` },
            { name: 'Noida B2B logistics', url: PAGE_URL },
          ],
        })}
      />
      <article className="relative flex-1 pb-8 sm:pb-12">
        <MarketingPageShell
          badge="Noida · Liftngo for business"
          title={<>Goods delivery, packs &amp; leases—built for Noida operations</>}
          lead={HERO_LEAD}
          chips={['Subscription', 'Lease', 'With / without driver', 'Vendor verified']}
          links={[
            { href: ROUTES.PICKUP_LOCATION, label: 'Book ride' },
            { href: `${PATH}#services`, label: 'Choose model' },
          ]}
          crumbs={[
            { label: 'Home', href: '/' },
            { label: 'Noida B2B logistics' },
          ]}
          heroAside={
            <div className="flex w-full max-w-md flex-col gap-3 lg:mx-0">
              <div className="rounded-2xl border border-white/20 bg-white/[0.07] p-4 shadow-lg ring-1 ring-white/10 backdrop-blur-sm transition-transform hover:-translate-y-0.5">
                <LayoutDashboard className="h-7 w-7 text-emerald-300" aria-hidden />
                <p className="mt-3 text-sm font-bold text-white">Same product as /noida</p>
                <p className="mt-1 text-xs leading-relaxed text-white/70">Dashboard entry, packs, rent, lease—not a separate tool.</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/[0.07] p-4 shadow-lg ring-1 ring-white/10 backdrop-blur-sm transition-transform hover:-translate-y-0.5">
                <Truck className="h-7 w-7 text-sky-300" aria-hidden />
                <p className="mt-3 text-sm font-bold text-white">2W · 3W · 4W cargo</p>
                <p className="mt-1 text-xs leading-relaxed text-white/70">Match vehicle class to the lane; quote before you commit.</p>
              </div>
            </div>
          }
          heroActions={
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <TrustBadge icon={<ShieldCheck className="h-4 w-4" />}>Reliability</TrustBadge>
                <TrustBadge icon={<Zap className="h-4 w-4" />}>Speed</TrustBadge>
                <TrustBadge icon={<BadgeCheck className="h-4 w-4" />}>Cost control</TrustBadge>
              </div>
              <NoidaB2bProductHeroActions />
            </div>
          }
        >
          <div className="relative z-10 mx-auto max-w-4xl px-0 pt-2">
            <NoidaB2bProductClient />
          </div>
        </MarketingPageShell>
      </article>
    </ContentLayout>
  );
}
