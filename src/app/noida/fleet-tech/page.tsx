import Link from 'next/link';
import { Check } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import { generatePageMetadata } from '@/lib/seo';
import { ROUTES } from '@/lib/constants';
import { SITE_NAME } from '@/lib/site';

const PATH = ROUTES.NOIDA_FLEET_TECH;

export const metadata = generatePageMetadata({
  title: `Fleet owner tech — assign & track your vehicles | ${SITE_NAME}`,
  description:
    'Own 2W, 3W, or 4W vehicles in Noida? Learn how Liftngo helps you organise drivers, assign trips to your registered fleet, track deliveries, and keep bookings within your operation — separate from ad hoc marketplace trips.',
  path: PATH,
  keywords: [
    'fleet management Noida',
    'own fleet logistics',
    'assign trips to drivers',
    'private fleet dispatch',
    'Liftngo fleet tech',
    'B2B vehicle tracking',
  ],
});

const SECTIONS: { title: string; bullets: string[] }[] = [
  {
    title: 'What this is for',
    bullets: [
      'You already run commercial vehicles (goods only — not passenger rides).',
      'You want one place to line up jobs, push them to your drivers, and see status without spreadsheets.',
      'You may want trips to stay inside your fleet — only vehicles and drivers you approve get assignments.',
    ],
  },
  {
    title: 'What Liftngo tech can help with',
    bullets: [
      'Trip intake and assignment flows tuned to your lanes and SLAs.',
      'Live GPS and digital handoff / proof-of-delivery patterns on supported runs.',
      'GST-ready billing hooks where your commercial agreement includes invoicing on those trips.',
      'Clear separation between “your fleet” workloads and one-off bookings you don’t own end-to-end.',
    ],
  },
  {
    title: 'How onboarding usually works',
    bullets: [
      'We validate your entity, vehicles, and who is allowed to receive dispatches.',
      'We align on pricing mechanics: per-trip, retainer, or hybrid — whatever matches your contract.',
      'You get access to the tools (or API handoffs) agreed in your order — not a generic consumer-only flow.',
    ],
  },
];

export default function NoidaFleetTechPage() {
  return (
    <PageContainer className="bg-gray-50/80 py-8 pb-20 pt-6 md:py-10" stack={false}>
      <div className="mx-auto max-w-3xl space-y-8">
        <nav className="text-sm">
          <Link href={ROUTES.NOIDA} className="font-medium text-[var(--color-primary)] hover:underline">
            ← Back to Noida dashboard
          </Link>
        </nav>

        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fleet owners</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Run your own fleet on Liftngo tech
          </h1>
          <p className="text-sm leading-relaxed text-slate-600 md:text-base">
            This page is for businesses that <strong className="font-semibold text-slate-800">own or control their vehicles</strong>{' '}
            and want to <strong className="font-semibold text-slate-800">organise, assign, and track</strong> trips — often with the rule
            that <strong className="font-semibold text-slate-800">only your registered fleet</strong> receives those jobs. Consumer-style
            “open marketplace” booking is a different path; here we’re describing a <strong className="font-semibold text-slate-800">fleet-operated</strong>{' '}
            mode governed by your agreement with Liftngo.
          </p>
        </header>

        <div className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
          {SECTIONS.map((block) => (
            <section key={block.title} className="space-y-3">
              <h2 className="text-base font-semibold text-slate-900 md:text-lg">{block.title}</h2>
              <ul className="space-y-2.5">
                {block.bullets.map((line) => (
                  <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-slate-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.25} aria-hidden />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section className="rounded-xl bg-slate-50 px-4 py-3 text-[13px] leading-relaxed text-slate-600">
            <strong className="text-slate-800">Important:</strong> capabilities, fleet-only rules, and commercial terms are set in your
            contract and product configuration — not inferred from this page. For a binding scope, use your order confirmation and Terms of
            Service.
          </section>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href={ROUTES.CONTACT}
            className="inline-flex items-center justify-center rounded-xl bg-[var(--color-primary)] px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-95"
          >
            Talk to us about fleet onboarding
          </Link>
          <Link
            href={ROUTES.PLANS_CUSTOM}
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            Open price calculator
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
