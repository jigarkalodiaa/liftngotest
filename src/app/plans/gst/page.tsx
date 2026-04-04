'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import { trackPlanSelected, trackViewPlan } from '@/lib/analytics';
import { Check, ArrowRight, Phone, FileText, Download, Building2 } from 'lucide-react';
import PlansSubPageShell from '../PlansSubPageShell';

const BILLING_CYCLES = [
  {
    name: 'Daily Billing',
    desc: 'Invoice generated after each trip. Best for ad-hoc bookings.',
    bestFor: 'Small businesses, individual bookings',
    features: ['Invoice per trip', 'GSTIN on every bill', 'Digital copy via email/WhatsApp'],
  },
  {
    name: 'Weekly Billing',
    desc: 'Consolidated invoice every Monday for the past week.',
    bestFor: 'Regular shippers, retail stores',
    features: ['Weekly summary invoice', 'Trip-wise breakdown', 'Accounts-friendly format', 'Auto-email to your CA'],
  },
  {
    name: 'Monthly Billing',
    desc: 'Single invoice at month-end. Ideal for subscription plan users.',
    bestFor: 'Enterprises, warehouses, subscription users',
    features: ['Monthly consolidated invoice', 'HSN-wise breakup', 'Custom PO number support', 'Dedicated account manager', 'API for ERP integration'],
  },
];

const USE_CASES = [
  { icon: '🏪', title: 'Retail & shops', desc: 'Daily GST invoices for each delivery to reconcile with your purchases.' },
  { icon: '🏭', title: 'Warehouses', desc: 'Monthly consolidated billing aligned with your inventory cycles.' },
  { icon: '📦', title: 'E-commerce', desc: 'Per-order invoicing with SKU-level notes for marketplace sellers.' },
  { icon: '🏢', title: 'Corporate offices', desc: 'Department-wise cost allocation with custom PO references.' },
];

export default function GstPage() {
  const router = useRouter();

  return (
    <PlansSubPageShell
      title="GST billing"
      subtitle="Compliant invoicing for every business — daily, weekly, or monthly cycles."
      badge="Invoicing"
      contentClassName="-mt-6"
    >
      <div className="flex min-w-0 flex-col gap-4 rounded-2xl border border-blue-200 bg-blue-50 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between md:p-5">
        <div className="flex min-w-0 items-start gap-3 sm:items-center">
          <FileText className="h-5 w-5 shrink-0 text-blue-600" />
          <div>
            <p className="text-sm font-bold text-blue-900">See what your invoice looks like</p>
            <p className="text-xs text-blue-600">Download a sample GST invoice (PDF)</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => trackViewPlan('gst_sample', 'gst_page')}
          className="flex min-h-11 w-full shrink-0 items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-blue-700 sm:w-auto sm:rounded-lg sm:py-2"
        >
          <Download className="h-3.5 w-3.5 shrink-0" />
          Sample
        </button>
      </div>

      <h2 className="mt-8 text-xs font-bold uppercase tracking-wider text-gray-400 md:text-sm">Choose your billing cycle</h2>
      <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {BILLING_CYCLES.map((cycle) => (
          <div
            key={cycle.name}
            className="flex min-w-0 flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md md:p-5"
          >
            <h3 className="text-base font-bold text-gray-900 md:text-lg">{cycle.name}</h3>
            <p className="mt-1 text-xs text-gray-500">{cycle.desc}</p>
            <p className="mt-2 inline-block w-fit rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-bold text-gray-600">
              Best for: {cycle.bestFor}
            </p>
            <ul className="mt-3 flex-1 space-y-1.5">
              {cycle.features.map((f) => (
                <li key={f} className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" strokeWidth={2.5} />
                  {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => {
                trackPlanSelected(cycle.name, 'gst');
                router.push(ROUTES.CONTACT);
              }}
              className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-200 active:scale-[0.98] md:min-h-11 md:py-3"
            >
              Enable {cycle.name}
              <ArrowRight className="h-4 w-4 shrink-0" />
            </button>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-xs font-bold uppercase tracking-wider text-gray-400 md:text-sm">Who uses GST billing</h2>
      <div className="mt-4 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {USE_CASES.map((uc) => (
          <div key={uc.title} className="min-w-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm md:p-5">
            <span className="text-2xl" aria-hidden>
              {uc.icon}
            </span>
            <h3 className="mt-2 text-sm font-bold text-gray-900">{uc.title}</h3>
            <p className="mt-1 text-[11px] leading-snug text-gray-500 md:text-xs">{uc.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-gradient-to-br from-[#1e1f4b] via-[#2C2D5B] to-[#3d3f7a] p-5 text-center text-white shadow-lg md:p-8">
        <Building2 className="mx-auto h-8 w-8 text-white/50" />
        <h2 className="mt-3 text-base font-bold md:text-lg">Enterprise billing needs?</h2>
        <p className="mt-1 text-xs text-white/70 md:text-sm">Custom integrations, ERP sync, and dedicated invoicing — talk to our team.</p>
        <button
          type="button"
          onClick={() => {
            trackViewPlan('gst_enterprise', 'gst_page');
            router.push(ROUTES.CONTACT);
          }}
          className="mx-auto mt-4 flex min-h-12 w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-gray-900 shadow-lg transition-all duration-200 active:scale-[0.98] sm:w-auto sm:min-h-11 sm:py-3"
        >
          <Phone className="h-4 w-4 shrink-0" />
          Contact sales
        </button>
      </div>
    </PlansSubPageShell>
  );
}
