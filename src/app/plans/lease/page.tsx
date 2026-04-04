'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/lib/constants';
import PlansSubPageShell from '../PlansSubPageShell';
import { trackPlanSelected, trackCheckoutStarted, trackViewPlan } from '@/lib/analytics';
import { Check, ArrowRight, Phone, TrendingUp, Shield, Wrench } from 'lucide-react';

type LeasePlan = { vehicle: string; term6: number; term12: number; earning: number; responsibilities: string[] };

const LEASE_PLANS: LeasePlan[] = [
  {
    vehicle: '2-Wheeler (EV)',
    term6: 18000,
    term12: 15000,
    earning: 35000,
    responsibilities: ['Charging at your end', 'Minor maintenance included', 'Insurance covered by Liftngo'],
  },
  {
    vehicle: '3-Wheeler Cargo',
    term6: 28000,
    term12: 24000,
    earning: 55000,
    responsibilities: ['Fuel/charging at your end', 'Routine maintenance included', 'Insurance covered by Liftngo', 'Major repairs covered'],
  },
  {
    vehicle: '4-Wheeler (Mini Truck)',
    term6: 45000,
    term12: 38000,
    earning: 85000,
    responsibilities: ['Fuel at your end', 'Routine maintenance included', 'Insurance covered', 'Roadside assistance included'],
  },
];

export default function LeasePage() {
  const router = useRouter();

  return (
    <PlansSubPageShell
      title="Lease a vehicle"
      subtitle="Ownership-like control, zero upfront cost — 6 or 12 month terms with platform earning potential."
      badge="Long-term lease"
      contentClassName="-mt-6"
    >
        <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4 shadow-sm md:p-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-violet-600" />
            <p className="text-sm font-bold text-violet-800">Earn while you lease</p>
          </div>
          <p className="mt-1 text-xs text-violet-600">
            Use the vehicle on Liftngo&apos;s platform to earn ₹35k–₹85k/month — covering lease cost and generating profit.
          </p>
        </div>

        <div className="mt-8 grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
          {LEASE_PLANS.map((plan) => {
            const roi12 = plan.earning - plan.term12;
            return (
              <div
                key={plan.vehicle}
                className="flex min-w-0 flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md md:p-5"
              >
                <h2 className="text-lg font-bold text-gray-900">{plan.vehicle}</h2>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-gray-50 p-3 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">6 Month Lease</p>
                    <p className="mt-1 text-xl font-extrabold text-gray-900">₹{plan.term6.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-gray-500">/month</p>
                  </div>
                  <div className="rounded-xl bg-violet-50 p-3 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-violet-600">12 Month Lease</p>
                    <p className="mt-1 text-xl font-extrabold text-violet-700">₹{plan.term12.toLocaleString('en-IN')}</p>
                    <p className="text-[10px] text-violet-500">/month · Best rate</p>
                  </div>
                </div>

                {/* ROI breakdown */}
                <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-600">Monthly ROI (12-month)</p>
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-gray-600">Earning potential</span>
                    <span className="font-bold text-gray-900">₹{plan.earning.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Lease cost</span>
                    <span className="font-bold text-red-500">-₹{plan.term12.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between border-t border-emerald-200 pt-1 text-sm">
                    <span className="font-bold text-emerald-700">Net profit</span>
                    <span className="text-lg font-extrabold text-emerald-600">₹{roi12.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Responsibilities */}
                <div className="mt-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">What&apos;s included</p>
                  <ul className="mt-2 space-y-1.5">
                    {plan.responsibilities.map((r) => (
                      <li key={r} className="flex items-center gap-1.5 text-xs text-gray-600">
                        {r.includes('your end') ? (
                          <Wrench className="h-3.5 w-3.5 shrink-0 text-amber-500" strokeWidth={2} />
                        ) : (
                          <Shield className="h-3.5 w-3.5 shrink-0 text-emerald-500" strokeWidth={2} />
                        )}
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 flex min-w-0 flex-col gap-2 sm:flex-row sm:gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      trackPlanSelected(plan.vehicle, 'lease');
                      trackCheckoutStarted('lease', plan.term12);
                      router.push(ROUTES.CONTACT);
                    }}
                    className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-3.5 text-sm font-bold text-white shadow-sm transition-all duration-200 active:scale-[0.98] md:min-h-11 md:py-3"
                  >
                    Lease now
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      trackViewPlan('lease_roi', 'lease_page');
                      router.push(ROUTES.CONTACT);
                    }}
                    className="flex min-h-12 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition-all duration-200 hover:bg-gray-50 active:scale-[0.98] sm:min-h-11"
                  >
                    <Phone className="h-4 w-4 shrink-0" />
                    ROI report
                  </button>
                </div>
              </div>
            );
          })}
        </div>
    </PlansSubPageShell>
  );
}
